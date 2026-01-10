import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.local.VITE_API_URL, 
  withCredentials: true, //broweser will send the cookies to server autoatically after every single req

});

export default axiosInstance;