import axios from "axios";


const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const apiClient = axios.create({
     baseURL,
     headers:{
        "Content-Type": "application/json",
     },
     withCredentials: true,
    timeout: 10000, // 10 seconds timeout
    });

apiClient.interceptors.request.use((c) => {
  const t = localStorage.getItem("token");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

export default apiClient;
