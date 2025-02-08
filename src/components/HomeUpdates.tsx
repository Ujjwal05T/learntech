import React from 'react'
import Image from 'next/image'
function homeUpdates() {
  return (
    <>
    <div className="p-4 mt-3 text-gray-500 bg-neutral-900 ">
        <h1 className="text-xl font-bold text-center">Home Updates</h1>
        <div className='justify-center items-center flex flex-col px-4 my-4 bg-gray-500  text-white'>
          <Image src={'/'}  alt='Image' width={100} height={100} />
          <h1 className='text-lg font-bold'>Topic headline</h1>
          <p className='text-sm text-gray-800 p-4'>Detailed description of the topic in about two lines <span>...</span></p>
        </div>
        
    </div>
    </>
  )
}

export default homeUpdates
