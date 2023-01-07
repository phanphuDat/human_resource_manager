import axios from "axios";
import { getUserFromLocalStorage } from "./localStorage";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const user = getUserFromLocalStorage();
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
      return config;
    }
    else
    return config;
  },
  (error) => {
    console.log("Erro na Requisição: ", error);
    return Promise.reject(error);
  }
);

export default api;
