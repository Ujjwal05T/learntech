import React from 'react'
import HomeSidebar from '@/components/HomeSidebar'
import HomeHero from '@/components/HomeHero'
import HomeProgress from '@/components/HomeProgress'
import HomeUpdates from '@/components/HomeUpdates'
import HomeTimeline from '@/components/HomeTimeline'

export default function Home() {
  return (
    <div className='bg-black grid grid-cols-8 m-0  gap-4 h-screen '>
      <div className='hidden sm:block col-span-1  bg-neutral-900 mx-0'> 
        <HomeSidebar />
      </div>
      <div className='col-span-5'>
      <h1 className='p-4 text-xl font-bold text-gray-50'>Hey User!👋</h1>
        <HomeHero />

        <HomeTimeline />
      </div>
      <div className='col-span-2 border-l p-4 border-gray-200'>
        <HomeProgress />
    
        <HomeUpdates />
      </div>
    </div>
  )
}

