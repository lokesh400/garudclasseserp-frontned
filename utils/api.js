import axios from "axios";

export const API = axios.create({
  baseURL: "https://garudclasseserp.onrender.com",
  withCredentials: true,
});

// export const API = axios.create({
//   baseURL: "http://192.168.1.110:5000",
//   withCredentials: true,
// });



