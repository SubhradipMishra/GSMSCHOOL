import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7070",
  withCredentials: true,
});

export default API;
