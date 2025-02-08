import React from 'react'

function homeHero() {
  return (
    <div >
      <div className='w--full max-w-4xl mx-auto mt-8 p-4 md:p-6  bg-neutral-900 text-gray-50 mb-3'>
        <div className='block p-4'>
          <div className='p-4 my-2'>
            <h2 className='mb-4 text-xl'>Current Topic :-</h2>
            <div className='flex justify-between px-8'>
              <span>task name</span>
              <span>complete %</span>
            </div>
              
          </div>
          <div className='p-4'>
            <h2 className='text-xl'>Next Topics :-</h2>
            <div className='px-8'><p className='m-2'> next topics </p> </div>
          </div>
        </div>
      </div>      
    </div>
  )
}

export default homeHero
