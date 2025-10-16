'use client'
import OauthButton from '@/components/ui/OauthButton';
import { auth, googleProvider } from '@/lib/firebaseConfig';
import { getAdditionalUserInfo, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios'
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
           "avatar" : photoURL
        })
      }
      //after succes full login redirect to dashboard
      router.push('/dashboard')

    } catch (e) {
      setError('Something went wrong' + e)
      console.log(e)
    }
  }
  return (
    <div className='w-screen h-screen bg-white flex flex-col items-center justify-center'>
      <h2 className='text-purple-950 text-3xl mb-5'>Scout Me</h2>
      <div className='border border-gray-400 rounded w-96  h-60 flex flex-col gap-2 items-center justify-center'>
        <p className='text-center p-1   text-red-700 '>{error ? error : null}</p>
        <OauthButton onClick={handleGoogleAuth} text='Continue with Google' icon={<FcGoogle />} />
      </div>
    </div>
  )
}

export default Page
