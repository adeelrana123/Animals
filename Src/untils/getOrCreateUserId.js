import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get existing user ID from AsyncStorage, or create and store a new one
 */
const getOrCreateUserId = async () => {
  try {
    const existingUserId = await AsyncStorage.getItem('userId');
    if (existingUserId) {
      return existingUserId;
    }

    const newUserId = uuidv4(); // generate unique ID
    await AsyncStorage.setItem('userId', newUserId);
    return newUserId;
  } catch (error) {
    console.error('Error getting or creating userId:', error);
    return null;
  }
};

export default getOrCreateUserId;
