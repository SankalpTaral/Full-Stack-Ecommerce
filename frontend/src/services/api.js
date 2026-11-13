import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.29.103:7777",
  withCredentials: true,
});

export default api;