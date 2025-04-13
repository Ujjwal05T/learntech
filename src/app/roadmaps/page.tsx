"use client";
import React, { useEffect, useState } from "react";
import roadmapsData from "@/data/index.json";
import Link from "next/link";
import { Roadmaps } from "@/types/types";
import { motion } from "framer-motion";

export default function RoadmapPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a20] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-60 right-10 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-pink-600/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {mounted && (
          <>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl pt-12 sm:pt-6 md:text-6xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-8"
            >
              Tech Roadmaps
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-row justify-center items-center my-8"
            >
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-2xl text-center">
                <p className="text-slate-300 text-lg leading-relaxed">
                  Here are some of the most popular roadmaps that you can follow to
                  become a successful developer. These roadmaps are community-driven
                  and are designed to help you navigate your tech journey and make
                  informed decisions about your learning path.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center my-10"
            >
              <div className="relative w-24 h-[2px]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6"
            >
              {roadmapsData.roadmaps.map((roadmap: Roadmaps) => (
                <motion.div
                  key={roadmap.id}
                  variants={item}
                  className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 transform hover:scale-[1.02]"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Link href={`/roadmaps/${roadmap.slug}`} className="flex flex-col h-full p-6">
                    <div className="flex justify-between text-white text-sm mb-5">
                      <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30 text-xs font-medium">
                        {roadmap.time}
                      </span>
                      <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 text-xs font-medium">
                        {roadmap.difficulty}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {roadmap.title}
                    </h2>
                    
                    <p className="text-slate-300 text-sm leading-relaxed flex-grow">
                      {roadmap.description}
                    </p>
                    
                    <div className="mt-5 pt-4 border-t border-gray-700/50">
                      <div className="flex items-center text-sm">
                        <span className="text-slate-400 font-medium">Prerequisites:</span>
                        <span className="ml-2 text-slate-300">{roadmap.preRequisites}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-end">
                      <span className="inline-flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                        Explore roadmap 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
