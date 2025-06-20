import axios from 'axios';

const api = axios.create({
//   baseURL: 'http://localhost:3000', // Use your LAN IP if on a device/emulator
    baseURL: 'http://192.168.29.100:3000',
});

export default api;