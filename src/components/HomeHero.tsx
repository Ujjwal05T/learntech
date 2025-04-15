'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaArrowRight, FaSpinner, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import { useToken } from '@/hooks/useToken';
import axios from 'axios';
import Link from 'next/link';

interface LearningItem {
  level: string;
  tech: string;
  topic: string;
  item: string;
  roadmapSlug: string;
  roadmapTitle: string;
}

interface RecommendationData {
  activeRoadmaps: number;
  lastCompleted: LearningItem | null;
  recommendations:LearningItem [];
  message: string;
}

function HomeHero() {
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useToken();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/progress/recommendations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setRecommendationData(response.data.data);
          // console.log('Recommendations:', response.data.data.recommendations);
        } else {
          setError('Could not load recommendations');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to load learning recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // If user is not authenticated or there's no data and we're not loading
  if ((!isAuthenticated() || !recommendationData) && !isLoading) {
    return (
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500" />
            Start Learning
          </h2>
          <p className="text-gray-300">
            Explore our roadmaps and start your learning journey today!
          </p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            <span className="ml-3 text-gray-300">Loading your recommendations...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl p-6 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <FaExclamationTriangle />
            <span>Error</span>
          </div>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Topic Section */}
      {recommendationData?.lastCompleted ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaCheckCircle className="text-blue-500" />
            Last Completed
          </h2>
          <Link href={`/roadmaps/${recommendationData.lastCompleted.roadmapSlug}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div>
                <span className="text-lg text-gray-200">{recommendationData.lastCompleted.item}</span>
                <div className="text-sm text-gray-400 mt-1">
                  {recommendationData.lastCompleted.tech} • {recommendationData.lastCompleted.topic}
                </div>
                <div className="text-xs text-blue-400 mt-1">
                  {recommendationData.lastCompleted.roadmapTitle}
                </div>
              </div>
              <span className="text-sm px-3 py-1 bg-green-900/30 text-green-400 rounded-full">
                Completed
              </span>
            </div>
          </Link>
        </motion.div>
      ) : null}

      {/* Next Topics Section */}
      {recommendationData?.recommendations.length! > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaArrowRight className="text-purple-500" />
            Recommended Next
          </h2>
          
          <div className="mb-4 px-4">
            <p className="text-gray-300 italic">{recommendationData?.message}</p>
          </div>
          
          <div className="space-y-4">
            {recommendationData?.recommendations.map((recommendation, index) => (
              <Link key={index} href={`/roadmaps/${recommendation.roadmapSlug}`}>
                <div 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <span className="text-lg text-gray-300">{recommendation.item}</span>
                    <div className="text-sm text-gray-400 mt-1">
                      {recommendation.tech} • {recommendation.topic}
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                      {recommendation.roadmapTitle}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">Start Now</span>
                </div>
              </Link>
            ))}
          </div>
          
          {recommendationData?.activeRoadmaps! > 0 && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-400">
                You have {recommendationData?.activeRoadmaps} active roadmap{recommendationData?.activeRoadmaps !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </motion.div>
      ) : null}
    </div>
  );
}

export default HomeHero;