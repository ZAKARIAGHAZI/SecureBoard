import axios from "axios";

// 🔧 Configurer Axios
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // 👉 adapte si ton backend tourne ailleurs
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🎯 Ajouter le token automatiquement s'il existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
