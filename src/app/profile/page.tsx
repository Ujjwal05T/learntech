import React from 'react'

function page() {
    const user ={
        img:"img",
        name: "John Doe",
        userId:"User Id",
        email: "johnDoe.com",
        phone: "1234567890",
        college: "XYZ College",
        skills: ["Skill 1", "Skill 2", "Skill 3"],
        education: "B.Tech in Computer Science",
        project: ["Project 1","Project 2","Project 3"]
        
    }
  return (
    <div className='grid grid-cols-3 md:grid-cols-3 gap-3  px-24 bg-[#0b1018] text-white'>
        {/* Left Side */}
        <div className='col-span-1'>
        <div className='m-4 my-8 p-8 border-2 border-gray-600 rounded-xl bg-[#121418]  '>
           
            <div className='p-8'>
                <p className='border-white border-2 rounded-full w-14 h-14  bg-slate-200 text-black justify-center items-center p-1'>{user.img}</p>
            </div>

            <h1 className='text-xl font-bold '>{user.name}</h1>
            <p className='text-sm from-neutral-100 m-0'>@{user.userId}</p>
            <p className='text-sm from-neutral-100 m-2'>{user.email}</p>
            <p className='text-sm from-neutral-100 m-2'>{user.phone}</p>
            <p className='text-sm from-neutral-100 m-2'>{user.college}</p>
        </div>
        <div className='my-8 m-4 p-8 border-2 border-gray-600 rounded-xl bg-[#121418]'>
            <h1 className='text-xl font-bold my-2'>My Resume</h1>
            <p className='text-blue-700'>my_cute_resume_:)</p>
        </div>
      </div>
      {/* Right Side */}
      <div className='col-span-2'>
        <div  className='my-8 m-4 p-8 border-2 border-gray-600 rounded-xl bg-[#121418] '>
            <h1 className='text-xl font-bold '>Certificates</h1>
                {/* {certificates.map((certificate) => {
                        return(
                            certificate
                        )
                }*/}
                <p className='text-sm from-neutral-100 my-4'>You do not have any certificates. <span className='text-blue-800 underline'>go learn something</span></p>
            </div>
        <div className='my-8 m-4 p-8 border-2 border-gray-600 rounded-xl bg-[#121418]'>
          <h1 className='text-xl font-bold '>Education</h1>
          <p className='text-sm from-neutral-100 my-4'>{user.education}</p>
        </div>
        <div className='m-4 p-8 border-2 border-gray-600 rounded-xl bg-[#121418]'>
          <h1 className='text-xl font-bold '>Skills</h1>
          <ul className='list-disc list-inside text-sm from-neutral-100 my-4'>
            {user.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className='m-4 p-8 border-2 border-gray-600 rounded-xl bg-[#121418]'>
            <h1 className='text-xl font-bold '>Links</h1>
            <ul className='list-disc list-inside text-sm from-neutral-100 my-4'>
            {user.project.map((project, index) => (
              <li key={index}>{project}</li>
            ))}

            </ul>
        </div>
      </div>
    </div>
  )
}

export default page
