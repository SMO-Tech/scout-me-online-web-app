// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBp26lmFEBtb9zeVjxiJxYN08RmnBNi9KY",
  authDomain: "scout-me-online-firebase.firebaseapp.com",
  projectId: "scout-me-online-firebase",
  storageBucket: "scout-me-online-firebase.firebasestorage.app",
  messagingSenderId: "436943845349",
  appId: "1:436943845349:web:69240dc2d4cf7ab8fae10c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()