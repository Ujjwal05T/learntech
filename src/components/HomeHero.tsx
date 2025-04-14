import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

interface RoadmapTask {
  id: string;
  name: string;
  progress: number;
}

function HomeHero() {
  // Mock data - replace with actual data from your roadmaps
  const currentTask: RoadmapTask = {
    id: '1',
    name: 'Introduction to JavaScript',
    progress: 65
  };

  const nextTasks: RoadmapTask[] = [
    {
      id: '2',
      name: 'JavaScript Functions & Objects',
      progress: 0
    },
    {
      id: '3',
      name: 'DOM Manipulation',
      progress: 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current Topic Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaCheckCircle className="text-blue-500" />
          Current Topic
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
          <span className="text-lg text-gray-200">{currentTask.name}</span>
          <div className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${currentTask.progress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-400">{currentTask.progress}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Topics Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaArrowRight className="text-purple-500" />
          Next Topics
        </h2>
        <div className="space-y-4">
          {nextTasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-lg text-gray-300">{task.name}</span>
              <div className="flex-1 h-[1px] border-b border-dashed border-gray-700"></div>
              <span className="text-sm text-gray-500">Upcoming</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default HomeHero;
