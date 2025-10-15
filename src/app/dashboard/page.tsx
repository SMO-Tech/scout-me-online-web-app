import MyNavbar from '@/components/layout/MyNavbar'
import React from 'react'

const Page = () => {
  return (
    <section className='min-w-screen flex items-center justify-center min-h-screen bg-white/95'>
        <MyNavbar />
        <div className='flex items-center justify-center'>
            <p className='text-black'>Welcome to dashboard</p>
        </div>
      
    </section>
  )
}

export default Page
