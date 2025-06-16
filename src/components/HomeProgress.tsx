'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaTrophy } from 'react-icons/fa';
import { useToken } from '@/hooks/useToken';
import axios from 'axios';
import Link from 'next/link';

// Interface for API response data structure
interface RoadmapProgress {
  roadmapSlug: string;
  title: string;
  percentage: number;
  lastUpdated: string;
  completedItems: {
    [level: string]: {
      [tech: string]: {
        [topic: string]: {
          [item: string]: boolean;
        };
      };
    };
  };
}

function HomeProgress() {
  const [progressData, setProgressData] = useState<RoadmapProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useToken();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/progress/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.data.success) {
          setProgressData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('Failed to load progress data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // Calculate top roadmap (highest percentage)
  const topRoadmap = Object.keys(progressData).length > 0 
    ? Object.values(progressData).reduce((prev, current) => 
        (prev.percentage > current.percentage) ? prev : current
      ) 
    : null;

  if (!isAuthenticated() || progressData.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Your Progress
        </h2>
        <div className="flex justify-center p-4">
          <div className="w-6 h-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Your Progress
        </h2>
        <div className="text-red-400 text-center">{error}</div>
      </div>
    );
  }

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
          <h3>Roadmap Progress</h3>
        </div>
        
        {Object.entries(progressData).map(([roadmapSlug, roadmap], index) => (
          <Link key={roadmapSlug} href={`/roadmaps/${roadmapSlug}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">{roadmap.title}</span>
                <span className="text-sm text-gray-400">
                  {roadmap.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${roadmap.percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last updated: {new Date(roadmap.lastUpdated).toLocaleDateString()}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Top Roadmap as Milestone Section */}
      {topRoadmap && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <FaTrophy className="text-yellow-500" />
            <h3>Top Roadmap</h3>
          </div>
          <Link href={`/roadmaps/${topRoadmap.roadmapSlug}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 rounded-lg p-4 hover:bg-gray-800/70 transition-colors cursor-pointer"
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-yellow-400">{topRoadmap.title}</h4>
                <p className="text-sm text-gray-400">
                  {topRoadmap.percentage}% Complete
                </p>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${topRoadmap.percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-center text-gray-500">
                Keep going! You&apos;re making great progress.
              </div>
            </motion.div>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export default HomeProgress;