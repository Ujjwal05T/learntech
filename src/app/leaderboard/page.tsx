'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
   _id: string
   username: string
   score: number
}

export default function LeaderBoardPage() {
   const [users, setUsers] = useState<User[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState('')

   useEffect(() => {
      const fetchLeaderboard = async () => {
         try {
            setLoading(true)
            const token = localStorage.getItem('token');
            const response = await axios.get(
               `${process.env.NEXT_PUBLIC_API_URL}/test/all`,
               { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(response.data.data)
            setLoading(false)
         } catch (err) {
            setError('Failed to fetch leaderboard data')
            setLoading(false)
            console.error(err)
         }
      }

      fetchLeaderboard()
   }, [])

   return (
      <div className="min-h-screen bg-[#0a0a20] py-12">
         {/* Simple background effect */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
         </div>
         
         <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-white mb-2">
                  Leaderboard
               </h1>
               <p className="text-gray-400">
                  See how you rank against other learners
               </p>
            </div>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
               <CardHeader className="border-b border-white/10 bg-white/5">
                  <div className="flex justify-between items-center">
                     <CardTitle className="text-xl text-white">Rankings</CardTitle>
                     <div className="text-sm text-blue-300">
                        {users.length} {users.length === 1 ? 'Participant' : 'Participants'}
                     </div>
                  </div>
               </CardHeader>
               
               <CardContent className="p-0">
                  {loading ? (
                     <div className="flex justify-center items-center py-12">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                     </div>
                  ) : error ? (
                     <div className="text-center py-8 px-4">
                        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">
                           <p>{error}</p>
                           <button 
                              onClick={() => window.location.reload()}
                              className="mt-2 px-4 py-1 bg-red-500/30 hover:bg-red-500/40 transition-colors rounded text-sm"
                           >
                              Try Again
                           </button>
                        </div>
                     </div>
                  ) : (
                     <div className="overflow-x-auto">
                        <table className="w-full text-white">
                           <thead className="text-xs uppercase tracking-wider bg-white/10">
                              <tr>
                                 <th className="w-16 py-3 px-6 text-left font-semibold">Rank</th>
                                 <th className="py-3 px-6 text-left font-semibold">Username</th>
                                 <th className="py-3 px-6 text-right font-semibold">Score</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/10">
                              {users.sort((a, b) => b.score - a.score).map((user, index) => (
                                 <tr 
                                    key={user._id} 
                                    className={`
                                       hover:bg-white/5 transition-colors
                                       ${index === 0 ? 'bg-yellow-500/10' : ''}
                                       ${index === 1 ? 'bg-gray-400/10' : ''}
                                       ${index === 2 ? 'bg-amber-700/10' : ''}
                                    `}
                                 >
                                    <td className="py-4 px-6">
                                       <span className={`font-medium
                                          ${index === 0 ? 'text-yellow-300' : ''}
                                          ${index === 1 ? 'text-gray-300' : ''}
                                          ${index === 2 ? 'text-amber-500' : ''}
                                          ${index > 2 ? 'text-gray-400' : ''}
                                       `}>
                                          {index + 1}
                                       </span>
                                    </td>
                                    <td className="py-4 px-6 font-medium">
                                       {index < 3 ? (
                                          <span className={`
                                             ${index === 0 ? 'text-yellow-300' : ''}
                                             ${index === 1 ? 'text-gray-300' : ''}
                                             ${index === 2 ? 'text-amber-500' : ''}
                                          `}>
                                             {user.username}
                                          </span>
                                       ) : user.username}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                       <span className={`
                                          font-medium
                                          ${index === 0 ? 'text-yellow-300' : ''}
                                          ${index === 1 ? 'text-gray-300' : ''}
                                          ${index === 2 ? 'text-amber-500' : ''}
                                          ${index > 2 ? 'text-blue-300' : ''}
                                       `}>
                                          {user.score}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                              
                              {users.length === 0 && (
                                 <tr>
                                    <td colSpan={3} className="text-center py-10 text-gray-400">
                                       <p>No results yet</p>
                                       <p className="mt-1 text-sm text-gray-500">Complete a test to appear on the leaderboard</p>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  )}
               </CardContent>
            </Card>
            
            <div className="mt-4 text-center text-xs text-gray-500">
               <p>Scores are updated after each completed test</p>
            </div>
         </div>
      </div>
   )


}