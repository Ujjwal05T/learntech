import React from "react";
import { VideoCardProps } from "@/types/types";

function VideoCards({ videoSrc, title, authorName, aboutAuthor, description, uploadedTime, views }: VideoCardProps) {
	return (
		<div className="max-w-sm overflow-hidden bg-[#0603179e] rounded-lg shadow-lg">
			{/* Video Player */}
			<div className="relative h-52 shadow-lg">
				<iframe src={videoSrc.replace("youtu.be/", "www.youtube.com/embed/")} className="w-full h-full rounded-2xl" title={title} allowFullScreen />
			</div>

			{/* Video Description */}
			<div className="py-4 text-white">
				<h3 className="font-semibold text-lg truncate">
					{title}
					<span className="text-bold"> | </span>
					{description}
				</h3>
				<div className="flex justify-start gap-2 text-[#cccbcb] text-[14px] mt-1">
					<p className="">{authorName}</p>
					<span> | </span>
					<p className="">{aboutAuthor}</p>
				</div>
				<div className="flex justify-between text-gray-500 text-sm mt-2">
					<span>{uploadedTime}</span>
					<span>{views} views</span>
				</div>
			</div>
		</div>
	);
}

export default VideoCards;
