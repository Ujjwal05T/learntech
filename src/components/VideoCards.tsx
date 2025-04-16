import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";

interface VideoCardProps {
  videoSrc: string;
  title: string;
  description: string;
  authorName: string;
  uploadedTime: string;
}

function VideoCards({ 
  videoSrc, 
  title, 
  authorName, 
  // description, value not used in the component, consider checking it in future
  uploadedTime 
}: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const baseUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
      return `${baseUrl}?modestbranding=1&rel=0&showinfo=0`;
    }
    return url;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group cursor-pointer w-full"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
          <video
            src={getVideoEmbedUrl(videoSrc)}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            preload="metadata"
            muted
            onMouseOver={e => (e.target as HTMLVideoElement).play()}
            onMouseOut={e => {
              const video = e.target as HTMLVideoElement;
              video.pause();
              video.currentTime = 0;
            }}
          />
          {/* Duration Badge */}
          {/* <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded z-20">
            3:24
          </div> */}
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-3">
          {/* Author Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0">
            <span className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
              {authorName[0].toUpperCase()}
            </span>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[15px] text-white line-clamp-2 mb-1 leading-5">
              {title}
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400 hover:text-white transition-colors">
                {authorName}
              </p>
              <div className="flex items-center text-gray-400">
                <span>{formatDistanceToNow(new Date(uploadedTime), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-[90%] max-w-6xl aspect-video bg-[#0a0a20] rounded-xl shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <video
                src={getVideoEmbedUrl(videoSrc)}
                className="w-full h-full object-contain"
                controls
                autoPlay
                controlsList="nodownload"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default VideoCards;