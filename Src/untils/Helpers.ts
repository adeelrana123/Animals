import AsyncStorage from '@react-native-async-storage/async-storage';
const storeStringValue = async (key: string, value: any) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (error) {
        console.log(error)
    }
}
const getStoredStringValue = async (key: string, setStoredValue: any, defaultValue: any) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            setStoredValue(value)
        } else {
            setStoredValue(defaultValue)
        }
    } catch (error) {
        console.log(error)
    }
}

export {storeStringValue, getStoredStringValue}