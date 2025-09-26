// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserData = async (user) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('AsyncStorage Error: ', error);
  }
};

export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to get user', e);
    return null;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('AsyncStorage Error: ', error);
  }
};
