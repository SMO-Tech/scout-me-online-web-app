import axios, { CreateAxiosDefaults } from "axios";
import { auth } from "@/lib/firebaseConfig";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Warn if baseURL is not set (only in development)
if (typeof window !== "undefined" && !baseURL && process.env.NODE_ENV === "development") {
  console.warn("⚠️ NEXT_PUBLIC_BASE_URL is not set. API calls will fail.");
}

const client = axios.create({
  baseURL: baseURL,
});

type heders = CreateAxiosDefaults<any>["headers"];

export const getClient = async (headers?: heders) => {
  let token: string | null = null;

  if (typeof window !== "undefined") {
    if (auth?.currentUser) {
      try {
        token = await auth.currentUser.getIdToken(true);
        localStorage.setItem("authToken", token);
      } catch (error) {
        console.error("Failed to get Firebase token:", error);
        token = localStorage.getItem("authToken");
      }
    } else {
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