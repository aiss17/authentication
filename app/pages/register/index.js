import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication';
import { getStatusBarHeight } from "react-native-status-bar-height";
import * as Crypto from 'expo-crypto';

import { Ionicons } from '@expo/vector-icons';
import { storeDataObject } from '../../services';

const EResult = {
    CANCELLED: 'CANCELLED',
    DISABLED: 'DISABLED',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
}

const Register = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backPressed);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backPressed);
        }
    }, [])

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

    const signUp = async () => {
        try {
            const hash = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA512,
                password
            );

            const payload = {
                username,
                password: hash
            }

            await storeDataObject('account', payload)
            navigation.replace('login')
        } catch (e) {
            console.log("there is an error => ", e)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Register</Text>
            </View>

            <View>
                <Text style={{ marginTop: 20, fontSize: 15, marginBottom: 5 }}>Username</Text>
                <TextInput
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    style={styles.textInput}
                />
                <Text style={{ marginTop: 10, fontSize: 15, marginBottom: 5 }}>Password:</Text>
                <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry
                    style={styles.textInput}
                />

                <TouchableOpacity onPress={() => signUp()} style={{ backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, marginTop: 15 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: getStatusBarHeight()
    },
    header: {
        marginTop: 15,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    textInput: {
        padding: 10,
        height: 40,
        borderWidth: .5,
        borderColor: 'grey',
        borderRadius: 10
    }
})