import axios, { CreateAxiosDefaults } from "axios";
import { getAuth } from "firebase/auth";


const  baseURL = process.env.NEXT_PUBLIC_FIREBASE_BASE_URL
const client = axios.create({
    baseURL : baseURL
})



type heders = CreateAxiosDefaults<any>['headers']

export const getClient = async (headers?: heders)=>{
    const auth =  getAuth()
    const token = auth.currentUser?.getIdToken()
  
    if(!token) return axios.create({baseURL});


    // passing Auhtorization token as default header and spreadin all other headers that we will accept form getClient Mehtod 
    const defaultHeaders = {
        Authorization: 'Bearer ' + token,
        ...headers
    };
    return axios.create({baseURL, headers: defaultHeaders})
}

export default client 