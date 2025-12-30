import axios, { CreateAxiosDefaults } from "axios";



const  baseURL = process.env.NEXT_PUBLIC_BASE_URL
console.log(baseURL)

// Warn if baseURL is not set (only in development)
if (typeof window !== 'undefined' && !baseURL && process.env.NODE_ENV === 'development') {
  console.warn('⚠️ NEXT_PUBLIC_BASE_URL is not set. API calls will fail.');
}

const client = axios.create({
    baseURL : baseURL
})



type heders = CreateAxiosDefaults<any>['headers']

export const getClient = async (headers?: heders)=>{
    let token = null;
    if(typeof window !== 'undefined'){
        token = localStorage.getItem("authToken");
    }
  
    if(!token) return axios.create({baseURL});


    // passing Auhtorization token as default header and spreadin all other headers that we will accept form getClient Mehtod 
    const defaultHeaders = {
        Authorization: 'Bearer ' + token,
        ...headers
    };
    return axios.create({baseURL, headers: defaultHeaders})
}

export default client 