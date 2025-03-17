'use client'
import React from "react";
import VideoCards from "@/components/VideoCards";
import NewsSidebar from "@/components/NewsSidebar";
import { useState, useEffect } from "react";
import { useToken } from '@/hooks/useToken'
import {useRouter} from 'next/navigation'
import LoadingScreen from '@/components/Loading'

function page() {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useToken();
  
    useEffect(() => {
      if (!isAuthenticated()) {
        setTimeout(() => {
          router.push('/login');
        }, 500);
      } else {
        setAuthorized(true);
      }
    }, [router, isAuthenticated]);
  
    if (!authorized) {
      return <LoadingScreen />;
    }

  return (
    <>
	<div className="flex flex-col md:flex-row bg-[#060317] h-full">
		<div className="hidden md:block md:w-1/5 "> 
			<NewsSidebar />

		</div>

      <section className="px-10 py-10  ">
        <div className=" grid xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          <VideoCards
            videoSrc="https://youtu.be/asdNfZfHT34?si=F_CYjGiRS361Ob3a"
            title="Frontent Roadmap"
            authorName="Sakshi Pandey"
            aboutAuthor="Software Engineere at Google"
            description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos repellat alias quae iure quam labore animi similique fuga at. Perferendis dicta nostrum architecto magni quidem aut aliquam alias quibusdam iste."
            views="20k"
            uploadedTime="2:45pm"
          />
          <VideoCards
            videoSrc="https://youtu.be/asdNfZfHT34?si=F_CYjGiRS361Ob3a"
            title="Frontent Roadmap"
            authorName="Sakshi Pandey"
            aboutAuthor="Software Engineere at Google"
            description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos repellat alias quae iure quam labore animi similique fuga at. Perferendis dicta nostrum architecto magni quidem aut aliquam alias quibusdam iste."
            views="20k"
            uploadedTime="2:45pm"
          />
          <VideoCards
            videoSrc="https://youtu.be/asdNfZfHT34?si=F_CYjGiRS361Ob3a"
            title="Frontent Roadmap"
            authorName="Sakshi Pandey"
            aboutAuthor="Software Engineere at Google"
            description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos repellat alias quae iure quam labore animi similique fuga at. Perferendis dicta nostrum architecto magni quidem aut aliquam alias quibusdam iste."
            views="20k"
            uploadedTime="2:45pm"
          />
          <VideoCards
            videoSrc="https://youtu.be/asdNfZfHT34?si=F_CYjGiRS361Ob3a"
            title="Frontent Roadmap"
            authorName="Sakshi Pandey"
            aboutAuthor="Software Engineere at Google"
            description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos repellat alias quae iure quam labore animi similique fuga at. Perferendis dicta nostrum architecto magni quidem aut aliquam alias quibusdam iste."
            views="20k"
            uploadedTime="2:45pm"
          />
        </div>
      </section>

	</div>
    </>
  );
}

export default page;
