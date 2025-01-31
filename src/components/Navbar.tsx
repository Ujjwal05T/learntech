import React from 'react'
import Link from 'next/link'
function Navbar() {
  return (
    <>
      <div className='p-4 border-b-4 flex justify-between static'>
        <div>
        <Link href="/" className='font-bold font-mono text-l text-gray-600'>LearnTech </Link>

        </div>
        <div >

        <Link className='px-6' href="/posts"> Posts</Link>
        <Link className='px-6' href="/roadmaps"> Roadmaps</Link>
        <Link className='px-6' href="/profile">Profile </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
