import React from 'react'
import MyNavbar from '@/components/layout/MyNavbar'
const layout = ({ children }) => {
  return (
    <section className='w-screen flex h-auto bg-white/95'>
          <MyNavbar />
         {children}
   
    </section>
  )
}

export default layout
