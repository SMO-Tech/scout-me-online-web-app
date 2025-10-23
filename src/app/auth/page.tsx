'use client'
import { auth, facebookProvider, googleProvider } from '@/lib/firebaseConfig';
import { getAdditionalUserInfo, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios'
import { FaFacebook } from 'react-icons/fa';
const Page = () => {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleGoogleAuth = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider)
      // Extract user info
      const user = res.user;
      const { displayName, email, photoURL, uid, phoneNumber } = user;

      // Check if first-time sign-in
      const info = getAdditionalUserInfo(res);
      console.log(info)
      const isNewUser = info?.isNewUser;
      console.log("User Info:", { displayName, email, photoURL, uid });
      console.log("First time user?", isNewUser);

      //Call our API for saving user Data
      if (isNewUser) {
        await axios.post('http://app.wizard.net.co//api/register/', {
          "user_sub": uid,
          "name": displayName,
          "email": email,
          "phoneno": phoneNumber,
          "auth_provider": "google",
          "avatar": photoURL
        })
      }
      //after succes full login redirect to dashboard
      router.push('/dashboard')

    } catch (e) {
      setError('Something went wrong' + e)
      console.log(e)
    }
  }

  const handleFacebookAuth = async () => {
    try {
      // 1. Trigger the Facebook sign-in popup
      const res = await signInWithPopup(auth, facebookProvider);

      // 2. Extract user info from the result
      const user = res.user;
      const { displayName, email, photoURL, uid, phoneNumber } = user;

      // 3. Check if first-time sign-in (same as Google)
      const info = getAdditionalUserInfo(res);
      console.log(info);
      const isNewUser = info?.isNewUser;

      console.log("User Info:", { displayName, email, photoURL, uid });
      console.log("First time user?", isNewUser);

      // 4. Call your API for saving user Data if it's a new user
      // if (isNewUser) {
      //   // NOTE on Data: Facebook may not always provide 'phoneNumber'
      //   // You may need to adjust your API call or database to handle a null phone number.
      //   await axios.post('http://app.wizard.net.co//api/register/', {
      //     "user_sub": uid,
      //     "name": displayName,
      //     "email": email,
      //     // Firebase user object might not have a phone number from OAuth, 
      //     // so we use optional chaining/defaulting here.
      //     "phoneno": phoneNumber || null,
      //     "auth_provider": "facebook",
      //     "avatar": photoURL
      //   });
      // }

      // 5. After successful login redirect to dashboard
      router.push('/dashboard');

    } catch (e) {
        setError('Something went wrong: ' + e);
    }
  };
  return (
    (
      <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 flex flex-col items-center justify-center px-4">
        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center text-center animate-fadeIn">
          <h1 className="text-white text-4xl font-extrabold tracking-wide mb-4">
            Scout<span className="text-purple-300">Me</span>
          </h1>
          <p className="text-gray-200 text-base mb-8">
            Sign in securely to get started with your player analytics.
          </p>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            onClick={handleGoogleAuth}
            className="flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-5 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 w-full"
          >
            <FcGoogle size={24} />
            Continue with Google
          </button>
          <button
            onClick={handleFacebookAuth}
            className="flex items-center  mt-5 justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-5 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 w-full"
          >
            <FaFacebook  size={24} />
            Continue with Facebook
          </button>
        </div>
      </div>
    ))
}

export default Page
