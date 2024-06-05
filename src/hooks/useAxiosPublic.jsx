import axios from "axios";

const axiosPublic = axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: 'https://medicare-server-umber.vercel.app',
})

const useAxiosPublic = () => {
    return axiosPublic
};

export default useAxiosPublic;