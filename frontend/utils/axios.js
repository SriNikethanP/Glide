import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "http://192.168.31.211:5000/api",
  withCredentials: true,
});

export default axiosInstance;
