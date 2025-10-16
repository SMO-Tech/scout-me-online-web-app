'use client'
import MyNavbar from '@/components/layout/MyNavbar'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const {push} = useRouter()
  return (
      <div className="pt-25 flex flex-col w-full justify-center items-center bg-black p-5  sm:p-10">
        <h1 className="text-white mt-5 text-3xl sm:text-4xl font-extrabold mb-6 text-center ">
          Let's get your first game analised <br />
          <span className="text-purple-500">and Unlock Your Potential</span>
        </h1>

        <p className="text-gray-300 text-center text-lg sm:text-xl mb-8">
          Paste your gameplay video link and let AI provide actionable insights instantly.
        </p>

        <button onClick={()=>push('/dashboard/form')} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300">
          Let’s Analyse
        </button>
      </div>

  )
}

export default Page
