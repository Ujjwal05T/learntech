import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HachathonResultPage() {
     return(
      <div className="min-h-screen bg-[#0a0a20] py-12">
         {/* Simple background effect */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl"></div>
         </div>
         
         <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-white mb-2">
                  Hack-Arambh Results
               </h1>
               <p className="text-gray-400">
                  Final rankings for the hackathon competition
               </p>
            </div>
            
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
               <CardHeader className="border-b border-white/10 bg-white/5">
                  <div className="flex justify-between items-center">
                     <CardTitle className="text-xl text-white">Team Rankings</CardTitle>
                     <div className="text-sm text-blue-300">
                        Top 9 teams
                     </div>
                  </div>
               </CardHeader>
               
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                     <table className="w-full text-white">
                        <thead className="text-xs uppercase tracking-wider bg-white/10">
                           <tr>
                              <th className="w-16 py-3 px-6 text-left font-semibold">Rank</th>
                              <th className="py-3 px-6 text-left font-semibold">Team Name</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                           {[
                              "Lazy Coders",
                              "Code Smashers",
                              "Trio Code",
                              "Bit Knights",
                              "Hack Elite",
                              "Coders Club",
                              "Tech Titans",
                              "Software Savvy",
                              "Runtime Terror"
                           ].map((teamName, index) => (
                              <tr 
                                 key={index} 
                                 className={`
                                    hover:bg-white/5 transition-colors
                                    ${index === 0 ? 'bg-yellow-500/10' : ''}
                                    ${index === 1 ? 'bg-gray-400/10' : ''}
                                    ${index === 2 ? 'bg-amber-700/10' : ''}
                                 `}
                              >
                                 <td className="py-4 px-6">
                                    <span className={`font-medium text-lg
                                       ${index === 0 ? 'text-yellow-300' : ''}
                                       ${index === 1 ? 'text-gray-300' : ''}
                                       ${index === 2 ? 'text-amber-500' : ''}
                                       ${index > 2 ? 'text-gray-400' : ''}
                                    `}>
                                       {index + 1}
                                       {index === 0 && '🏆'}
                                       {index === 1 && '🥈'}
                                       {index === 2 && '🥉'}
                                    </span>
                                 </td>
                                 <td className="py-4 px-6 font-medium">
                                    <span className={`
                                       ${index === 0 ? 'text-yellow-300' : ''}
                                       ${index === 1 ? 'text-gray-300' : ''}
                                       ${index === 2 ? 'text-amber-500' : ''}
                                       ${index > 2 ? 'text-white' : ''}
                                    `}>
                                       {teamName}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </CardContent>
            </Card>
            
            <div className="mt-4 text-center text-xs text-gray-500">
               <p>Congratulations to all participating teams!</p>
            </div>
         </div>
      </div>
   )
}

