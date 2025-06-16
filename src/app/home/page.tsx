'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HomeHero from '@/components/HomeHero'
import HomeProgress from '@/components/HomeProgress'
import HomeUpdates from '@/components/HomeUpdates'
import { useToken } from '@/hooks/useToken'
import { useRouter } from 'next/navigation'
import LoadingScreen from '@/components/Loading'
import { useUserStore } from '@/../stores/user-store'

export default function Home() {
  const [authorized, setAuthorized] = useState(false); // Changed to true to bypass auth
  const router = useRouter();
  const { isAuthenticated } = useToken();
  const { user } = useUserStore();

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
    <div className="min-h-screen bg-gradient-to-b from-[#060317] to-[#0c0825] text-white">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-600/10 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">
            {/* Header Section */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-14 w-14 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                >
                  <span className="text-white text-xl font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || '👋'}
                  </span>
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Welcome back, {user?.username || 'Explorer'}!
                  </h1>
                  <p className="text-gray-400">Continue your learning journey</p>
                </div>
              </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Content Area */}
              <div className="xl:col-span-3 space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors"
                >
                  <HomeHero />
                </motion.div>
              </div>

              {/* Right Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors"
                >
                  <HomeProgress />
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800/30 shadow-xl hover:border-gray-700/50 transition-colors"
                >
                  <HomeUpdates />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}