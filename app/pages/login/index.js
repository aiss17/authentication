import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication';
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

import { getDataObject } from '../../services';

const EResult = {
    CANCELLED: 'CANCELLED',
    DISABLED: 'DISABLED',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
}

const Login = ({ navigation }) => {
    const [facialRecognitionAvailable, setFacialRecognitionAvailable] = useState(false);
    const [fingerprintAvailable, setFingerprintAvailable] = useState(false);
    const [irisAvailable, setIrisAvailable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [account, setAccount] = useState(null)
    const [result, setResult] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("")

    const getAccount = async () => {
        const accounts = await getDataObject('account');

        setAccount(accounts);
    }

    useEffect(() => {
        getAccount()
        checkSupportedAuthentication()
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

    const checkSupportedAuthentication = async () => {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (types && types.length) {
            setFacialRecognitionAvailable(types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION));
            setFingerprintAvailable(types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT));
            setIrisAvailable(types.includes(LocalAuthentication.AuthenticationType.IRIS));
        }
    };

    const authenticateBiomet = async () => {
        try {
            const results = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login With Biometrics',
                cancelLabel: 'Cancel',
                disableDeviceFallback: true,
            });

            if (results.success) {
                navigation.navigate("Home")
            } else if (results.error === 'unknown') {
                setResult(EResult.DISABLED);
            } else if (
                results.error === 'user_cancel' ||
                results.error === 'system_cancel' ||
                results.error === 'app_cancel'
            ) {
                setResult(EResult.CANCELLED);
            }
        } catch (error) {
            console.log("there is an error => ", error)
            setResult(EResult.ERROR);
        }
    };

    const authenticateText = async () => {
        try {
            const hash = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA512,
                password
            );

            const payload = {
                username,
                password: hash
            }

            if (JSON.stringify(payload) == JSON.stringify(account)) {
                navigation.replace('Home')
            }
        } catch (error) {
            console.log("there is an error => ", error)
            setResult(EResult.ERROR);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Login</Text>
            </View>


            {account !== null ? (
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

                    <TouchableOpacity onPress={() => authenticateText()} style={{ backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, marginTop: 15 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
                    </TouchableOpacity>

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                        <TouchableOpacity onPress={() => authenticateBiomet()} style={{ borderRadius: 10, backgroundColor: 'orange', padding: 5 }}>
                            <Ionicons name="finger-print-outline" size={50} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                    <Text>You don't have an account, </Text>
                    <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('Register')}>register here!</Text>
                </View>
            )}
        </View>
    )
}

export default Login

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