import { BackHandler, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { FontAwesome } from '@expo/vector-icons';
import CryptoES from "crypto-es";
import * as LocalAuthentication from 'expo-local-authentication';
import { Base64 } from 'js-base64';

import { getDataObject, storeDataObject } from '../../services'

const SECURE_KEY = "freepalestine";

const List = () => {
    const [data, setData] = useState([])
    const [notes, setNotes] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [id, setId] = useState(null)
    const [titleModal, setTitleModal] = useState("")

    const backPressed = () => {
        if (Platform.OS === "ios") {
            // Minimize the app on iOS
            return true;
        } else {
            Alert.alert(
                "Exit App",
                "Exiting the application?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: () => BackHandler.exitApp()
                    }
                ],
                {
                    cancelable: false
                }
            );
            return true;
        }
    };

    useEffect(() => {
        getData()
        BackHandler.addEventListener("hardwareBackPress", backPressed);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backPressed);
        }
    }, [])


    const getData = async () => {
        try {
            const datas = await getDataObject('list');

            setData(datas);
        } catch (e) {
            console.log("there is an error => ", e)
        }
    }

    const addData = async () => {
        try {
            setSubmitted(true)

            const encrypted = CryptoES.AES.encrypt(SECURE_KEY, notes).toString();
            // const encrypted = Base64.encode(notes);

            if (notes !== "") {
                const datas = await getDataObject('list');

                if (datas !== null) {
                    const dataNotes = {
                        id: data.length + 1,
                        notes: encrypted
                    }

                    datas.push(dataNotes);
                    await storeDataObject('list', datas)
                } else {
                    const dataNotes = [
                        {
                            id: 1,
                            notes: encrypted
                        }
                    ]

                    await storeDataObject('list', dataNotes)
                }

                setNotes("")
                setModalVisible(!modalVisible)
                getData()
            }
        } catch (e) {
            console.log("there is an error => ", e)
        }
    }

    const editData = async () => {
        try {
            setSubmitted(true)

            const encrypted = CryptoES.AES.encrypt(SECURE_KEY, notes).toString();
            // const encrypted = Base64.encode(notes);

            if (notes !== "") {
                let datas = await getDataObject('list');

                let indexID = datas.findIndex((val) => val.id === id)
                datas[indexID].notes = encrypted // change value notes

                await storeDataObject('list', datas)

                setNotes("")
                setModalVisible(!modalVisible)
                getData()
            }
        } catch (e) {
            console.log("there is an error => ", e)
        }
    }

    const authenticateBiomet = async (item) => {
        try {
            const results = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login With Biometrics',
                cancelLabel: 'Cancel',
                disableDeviceFallback: true,
            });

            if (results.success) {
                let Decrypted = CryptoES.AES.decrypt(SECURE_KEY, item.notes);

                setId(item.id)
                setNotes(item.notes)
                setTitleModal("Edit Notes")
                setModalVisible(!modalVisible)
            } else if (results.error === 'unknown') {
                console.log(results.warning);
            } else if (
                results.error === 'user_cancel' ||
                results.error === 'system_cancel' ||
                results.error === 'app_cancel'
            ) {
                console.log(results.warning);
            }
        } catch (error) {
            console.log("there is an error => ", error)
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List</Text>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{titleModal}</Text>

                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            value={notes}
                            onChangeText={(text) => setNotes(text)}
                            style={styles.textInput}
                            placeholder={"Notes"}
                            textAlignVertical={"top"}
                            keyboardType={"default"}
                        />
                        {submitted && notes == "" && (
                            <Text style={{ color: 'red', textAlign: 'left', width: '100%', fontSize: 12, fontStyle: 'italic' }}>Notes is required</Text>
                        )}

                        <TouchableOpacity
                            style={styles.btnSave}
                            onPress={() => {
                                if (id !== null) {
                                    editData()
                                } else {
                                    addData()
                                }
                            }}
                        >
                            <Text style={{ color: 'white' }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            style={{ borderRadius: 10, borderWidth: 1, marginVertical: 5, padding: 10 }}
                            activeOpacity={.5}
                            onPress={() => {
                                authenticateBiomet(item)
                            }}
                        >
                            <Text style={{ fontSize: 15 }}>Note {item.id}</Text>
                            <Text>{item.notes}</Text>
                        </TouchableOpacity>
                    )
                }}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    // addData();
                    setTitleModal("Add Notes")
                    setModalVisible(!modalVisible)
                }}
            >
                <View style={styles.contentFab}>
                    <FontAwesome name="angle-double-up" size={30} color="white" />
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default List

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: getStatusBarHeight()
    },
    header: {
        marginVertical: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#055DB3",
        position: "absolute",
        bottom: 20,
        right: 20,
        justifyContent: "center",
        opacity: 0.9,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8
    },
    contentFab: {
        justifyContent: "center",
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        width: '75%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'left',
        width: '100%',
        fontSize: 20,
        fontWeight: 'bold'
    },
    textInput: {
        padding: 10,
        height: 80,
        borderWidth: .5,
        borderColor: 'grey',
        borderRadius: 10,
        width: '100%',
    },
    btnSave: {
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginTop: 15
    }
})