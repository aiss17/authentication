import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { FontAwesome } from '@expo/vector-icons';

import { getDataObject, storeDataObject } from '../../services'

const List = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        getData()
        BackHandler.addEventListener("hardwareBackPress", backPressed);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backPressed);
        }
    }, [])

    const getData = async () => {
        const datas = await getDataObject('list');

        console.log(datas)
        // setData(accounts);
    }

    const addData = async () => {
        const datas = await storeDataObject('list');
        let parseData = JSON.parse(datas)

        console.log(parseData)
        if (parseData !== null) {

        }

        // getData()
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>List</Text>
            </View>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    addData();
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
        marginTop: 15,
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
})