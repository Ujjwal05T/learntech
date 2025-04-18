import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
        className="group cursor-pointer w-full max-w-md mx-auto transform transition-all duration-300 hover:-translate-y-1"
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card Container with Border */}
        <div className="bg-[#0c0c1d] rounded-xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/70 shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
          {/* Thumbnail Container */}
          <div className="relative aspect-video w-full overflow-hidden">
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
            {/* Play Button Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-16 h-16 rounded-full bg-purple-600/80 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform shadow-lg shadow-purple-600/20">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex gap-4">
              {/* Author Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0 shadow-md">
                <span className="w-full h-full flex items-center justify-center text-white font-semibold text-lg">
                  {authorName[0].toUpperCase()}
                </span>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-white line-clamp-2 mb-2 leading-tight">
                  {title}
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-300 hover:text-white transition-colors font-medium">
                    {authorName}
                  </p>
                  <div className="flex items-center text-gray-400 text-sm">
                    {formatDistanceToNow(new Date(uploadedTime), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Video Info Badge */}
            <div className="mt-4 pt-4 border-t border-purple-500/20 flex justify-between items-center">
              <span className="text-xs bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full">
                Featured Video
              </span>
              <span className="text-xs text-gray-400">
                Click to play
              </span>
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
              className="relative w-[90%] max-w-6xl aspect-video bg-[#0a0a20] rounded-xl shadow-2xl overflow-hidden border-2 border-purple-500/50"
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