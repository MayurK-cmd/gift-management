import axios from "axios";

const API = axios.create({
  baseURL: "https://gift-management.onrender.com/api",
  //baseURL: "http://localhost:3000/api", // Corrected to HTTP
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createGift = (giftData) => {
  return axiosInstance.post('/', giftData);
};

export const getGifts = (eventId) => {
  return axiosInstance.get(`?eventId=${eventId}`);
};

export const updateGift = (id, giftData) => {
  return axiosInstance.put(`/${id}`, giftData);
};

export const deleteGift = (id) => {
  return axiosInstance.delete(`/${id}`);
};
export default API;
