import React from "react";
import VideoCards from "@/components/VideoCards";
function page() {
	return (
		<section className="px-10 py-10 bg-[#060317] h-full ">
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
	);
}

export default page;
