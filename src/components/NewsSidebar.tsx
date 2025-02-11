import React from 'react'
import { Button } from './ui/button'

function NewsSidebar() {
  return (
    <div className='h-[100vh] bg-[#060317] p-5 text-white '>
        <div className="p-4">
            <h1 className=" text-2xl font-bold mb-4 text-center" >News</h1>
            <Button variant="newslink" size="lg" className='my-1 text-sm'>Home</Button>
            <Button variant="newslink" size="lg" className='my-1 text-sm'>Blog</Button>
            <Button variant="newslink" size="lg" className='my-1 text-sm'>Your Videos</Button>
        </div>
            <hr />
        <div className="p-4">
            <h1 className=" text-2xl font-bold mb-4 text-center" >You</h1>
            <Button variant="newslink" size="lg" className='my-1 text-sm'>Expert</Button>
            <Button variant="newslink" size="lg" className='my-1 text-sm'>News</Button>
            <Button variant="newslink" size="lg" className='my-1 text-sm'>Student</Button>
        </div>
            <hr />
        <div className='p-4'>
            <h1 className=" text-2xl font-bold mb-4 text-center" >Upcoming</h1>
            <div className='bg-[rgba(255,255,255,0.1)] border-none rounded-sm p-3'>

            <h2 className='text-center m-2'>Topic of nxt event</h2> 
            <Button variant="create" size="lg" className='my-1 hover:bg-black'>Ask a question</Button>
            </div>
        </div>

    </div>
  )
}

export default NewsSidebar
