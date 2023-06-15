import axios from "axios";

const API_ENDPOINT: String | undefined = process.env.REACT_APP_API_ENDPOINT;
const request = axios.create({
    baseURL: API_ENDPOINT?.toString(),
    withCredentials: true
})

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);;

export {API_ENDPOINT, request, isMobile}