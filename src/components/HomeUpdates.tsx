import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Define update item type
interface Update {
  id: number
  title: string
  description: string
  imageUrl: string
  date: string
}

function HomeUpdates() {
  // Example updates data
  const updates: Update[] = [
    {
      id: 1,
      title: "New JavaScript Roadmap",
      description: "Updated learning path for modern JavaScript development",
      imageUrl: "/file.svg",
      date: "2 hours ago"
    },
    {
      id: 2,
      title: "Frontend Development Guide",
      description: "Complete guide to becoming a frontend developer",  
      imageUrl: "/window.svg",
      date: "1 day ago"
    }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Latest Updates
      </h2>

      <div className="space-y-4">
        {updates.map((update) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                <Image
                  src={update.imageUrl}
                  alt={update.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white mb-1">{update.title}</h3>
                <p className="text-sm text-gray-400">{update.description}</p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {update.date}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default HomeUpdates
