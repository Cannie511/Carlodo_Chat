import { useAuthStore } from "@/app/stores/useAuthStore";
import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
})

// interceptor tự động gắn accessToken vào header request
api.interceptors.request.use((config)=>{
    const {accessToken} = useAuthStore.getState();
    if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // nếu 401 và chưa retry
    if (error.response?.data?.message === "TokenExpiredError" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refresh } = useAuthStore.getState();

        await refresh();

        // gọi lại request cũ
        return api(originalRequest);
      } catch (err) {
        // refresh fail → logout
        useAuthStore.getState().clearState();
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api