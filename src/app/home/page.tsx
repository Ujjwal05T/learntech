'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import HomeSidebar from '@/components/HomeSidebar'
import HomeHero from '@/components/HomeHero'
import HomeProgress from '@/components/HomeProgress'
import HomeUpdates from '@/components/HomeUpdates'
import HomeTimeline from '@/components/HomeTimeline'
import { useToken } from '@/hooks/useToken'
import { useRouter } from 'next/navigation'
import LoadingScreen from '@/components/Loading'
import { useUserStore } from '@/../stores/user-store'

export default function Home() {
  const [authorized, setAuthorized] = useState(false);
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
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:block w-64 border-r border-gray-800 bg-black/20 backdrop-blur-sm"
        >
          <HomeSidebar />
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-5">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-8 mt-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-12 w-12 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-blue-900/20"
                >
                  <span className="text-white text-lg font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || '👤'}
                  </span>
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Hey {user?.username || 'User'}! 👋
                  </h1>
                  <p className="text-gray-400 text-sm">Welcome to your personal dashboard</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main content (3/4 width on XL screens) */}
              <div className="xl:col-span-3 space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-800/50 shadow-xl"
                >
                  <HomeHero />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-800/50 shadow-xl"
                >
                  <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Activity Timeline
                  </h2>
                  <HomeTimeline />
                </motion.div>
              </div>

              {/* Right sidebar (1/4 width on XL screens) */}
              <div className="xl:col-span-1 space-y-6">
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-800/50 shadow-xl"
                >
                  <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Your Progress
                  </h2>
                  <HomeProgress />
                </motion.div>

                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-5 border border-gray-800/50 shadow-xl"
                >
                  <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Latest Updates
                  </h2>
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