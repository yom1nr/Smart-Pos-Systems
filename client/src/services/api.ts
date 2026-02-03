import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // ชี้ไปที่ Server ของเรา
});

export default api;