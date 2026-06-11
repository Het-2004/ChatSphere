import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// 10.0.2.2 is the IP address pointing to the host machine from the Android emulator.
// Use 'localhost' for iOS simulator or your local IP address for physical devices.
const BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:4040/api' 
  : 'http://localhost:4040/api';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach Authorization header before requests
client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
