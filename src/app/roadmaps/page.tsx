import React from "react";
import roadmapsData from "@/data/index.json";
import Link from "next/link";

interface Roadmap {
  id: number;
  slug: string;
  title: string;
  description: string;
  time: string;
  difficulty: string;
  preRequisites: string;
}
export default function Roadmaps() {
  return (
    <div className="bg-black">
      <h1 className="text-5xl pt-2 sm:pt-4 md:text-6xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-8 animate-fade-in">
        Tech Roadmaps
      </h1>
      <div className="flex flex-row justify-center items-center my-4">
        <div className="flex px-2 text-white justify-center sm:w-2/3">
          <p>
            Here are some of the most popular roadmaps that you can follow to
            become a successful developer. These roadmaps are community-driven
            and are designed to help you navigate your tech journey and make
            informed decisions about your learning path.
          </p>
        </div>
      </div>

      <hr className="h-px my-4 mx-4 bg-gray-600 border-0" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
  {roadmapsData.roadmaps.map((roadmap: Roadmap) => (
    <div
      key={roadmap.id}
      className="group bg-white/10 backdrop-blur-sm  border-2 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
    >
      <Link href={`/roadmaps/${roadmap.slug}`} className="flex flex-col h-full p-6">
        <div className="flex justify-between text-white text-sm mb-4">
          <span className="bg-gray-700/50 px-3 py-1 rounded-full">{roadmap.time}</span>
          <span className="bg-gray-700/50 px-3 py-1 rounded-full">{roadmap.difficulty}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-blue-400 transition-colors">
          {roadmap.title}
        </h2>
        
        <p className="text-gray-400 text-sm leading-relaxed flex-grow">
          {roadmap.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 font-medium">Prerequisites:</span>
            <span className="ml-2 text-gray-400">{roadmap.preRequisites}</span>
          </div>
        </div>
      </Link>
    </div>
  ))}
</div>
    </div>
  );
}
