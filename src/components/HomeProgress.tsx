import React from 'react'

function progress() {
  return (
    <>
      <div className=' p-4 bg-neutral-900 text-gray-50 '>
        <h1 className='text-center font-bold text-xl'>Progress</h1>
        <div className='block p-4'>
          <div className=' p-4 my-2'>
            <h2 className='text-center'>Current Progress</h2>
            <ul>
              <li>task 1 : 0</li>
              <li>task 2 : 0</li>
            </ul>
              
          </div>
          <div className=' p-4'>
            <h2 className='text-center'>Next Milestone</h2>
            <ul>
              <li>task 3 : 0</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default progress
