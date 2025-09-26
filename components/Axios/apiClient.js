import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'https://react-nativ-backend.vercel.app/api/v1';

const apiClient = axios.create({
  baseURL: 'https://react-nativ-backend.vercel.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      // console.log("Toekn", token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    } catch (error) {
      console.warn('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
