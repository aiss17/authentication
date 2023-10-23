import AsyncStorage from '@react-native-async-storage/async-storage';

const storeDataString = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
        console.log("there is an error => ", e)
    }
};

const storeDataObject = async (key, value) => {
    try {
        console.log(value)
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        // saving error
        console.log("there is an error => ", e)
    }
};

const getDataString = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // value previously stored
            return value
        } else {
            return null
        }
    } catch (e) {
        // error reading value
        console.log("there is an error => ", e)
    }
};

const getDataObject = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        console.log("there is an error => ", e)
    }
};

export { getDataString, getDataObject, storeDataString, storeDataObject }