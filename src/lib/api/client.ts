import axios, { CreateAxiosDefaults } from "axios";
import { auth } from "@/lib/firebaseConfig";

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
    
    // Try to get fresh token from Firebase if user is logged in
    if(typeof window !== 'undefined'){
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                // Get fresh token from Firebase (this will refresh if expired)
                token = await currentUser.getIdToken(true); // true = force refresh
                // Update localStorage with fresh token
                localStorage.setItem("authToken", token);
            } catch (error) {
                console.error("Failed to get Firebase token:", error);
                // Fallback to localStorage token
                token = localStorage.getItem("authToken");
            }
        } else {
            // No user logged in, try localStorage as fallback
            token = localStorage.getItem("authToken");
        }
    }
  
    if(!token) {
        console.warn("No auth token available");
        return axios.create({baseURL});
    }

    // passing Authorization token as default header and spreading all other headers that we will accept from getClient Method 
    const defaultHeaders = {
        Authorization: 'Bearer ' + token,
        ...headers
    };
    
    return axios.create({baseURL, headers: defaultHeaders})
}

export default client 