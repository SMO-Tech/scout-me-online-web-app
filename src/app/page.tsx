'use client'
import MyNavbar from '@/components/layout/MyNavbar'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {

  const router = useRouter()
  const handleGetStarted =()=>{
    router.push('/auth')
  }
  return (
    <>
      {/* Navbar */}
      <MyNavbar />
      <section className='w-screen h-screen bg-white/90 p-5'>
        <div className='w-full  h-full bg-purple-950 rounded-xl items-center justify-center flex-col flex'>
          <p className='text-center text-xl sm:text-3xl sm:px-20'>Stop waiting to be discovered — let AI put your talent in front of the right eyes.</p>
          <button
          onClick={handleGetStarted} 
            className='bg-white p-1  text-lg mt-3 text-black rounded hover:text-purple-700'>Get Started
          </button>
        </div>
      </section>
    </>
  )
}

export default page
