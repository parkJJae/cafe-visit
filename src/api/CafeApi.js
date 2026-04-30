import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const createCafe = (data) => api.post("/cafes", data);

export const getAllCafes = () => api.get("/cafes");
