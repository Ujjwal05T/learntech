import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaChartLine } from 'react-icons/fa';

interface Progress {
  taskName: string;
  completion: number;
  total: number;
}

interface Milestone {
  name: string;
  requiredPoints: number;
  currentPoints: number;
}

function HomeProgress() {
  // Replace with actual data from your roadmaps
  const currentProgress: Progress[] = [
    {
      taskName: "JavaScript Basics",
      completion: 3,
      total: 5
    },
    {
      taskName: "React Fundamentals",
      completion: 2,
      total: 8
    }
  ];

  // Replace with actual milestone data from database
  const nextMilestone: Milestone = {
    name: "JavaScript Developer",
    requiredPoints: 100,
    currentPoints: 65
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Your Progress
      </h2>

      {/* Current Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaChartLine className="text-blue-500" />
          <h3>Current Progress</h3>
        </div>
        {currentProgress.map((task, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">{task.taskName}</span>
              <span className="text-sm text-gray-400">
                {task.completion}/{task.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(task.completion / task.total) * 100}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Milestone Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaTrophy className="text-yellow-500" />
          <h3>Next Milestone</h3>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
        >
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-yellow-400">{nextMilestone.name}</h4>
            <p className="text-sm text-gray-400">
              {nextMilestone.currentPoints} / {nextMilestone.requiredPoints} points
            </p>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(nextMilestone.currentPoints / nextMilestone.requiredPoints) * 100}%` }}
            ></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default HomeProgress;
