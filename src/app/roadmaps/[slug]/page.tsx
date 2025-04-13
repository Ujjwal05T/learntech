"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import roadmapData from "@/data/data.json";
import slugData from "@/data/index.json";
import Link from "next/link";
import ErrorPage from "@/components/ErrorPage";
import { Roadmaps, DetailedRoadmap, RoadmapData } from "@/types/types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { MoveDown, MoveRight, CheckCircle, AlertTriangle, LogIn } from "lucide-react";
import { useParams } from "next/navigation";
import { useToken } from "@/hooks/useToken";
import axios from "axios";
import { motion } from "framer-motion";

// Interface for tracking item completion (more granular)
interface CompletedItems {
  [level: string]: {
    [tech: string]: {
      [topic: string]: {
        [item: string]: boolean;
      };
    };
  };
}

export default function RoadmapPage() {
  const params = useParams();
  const slug = params.slug as string;

  // State initialization
  const [isLoaded, setIsLoaded] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [response, setResponse] = useState<Roadmaps | null>(null);
  const [completedItems, setCompletedItems] = useState<CompletedItems>({});
  const [isSaving, setIsSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const { isAuthenticated } = useToken();

  const getToken = () => localStorage.getItem("token");

  // Load data and state on mount
  useEffect(() => {
    async function loadData() {
      if (slug) {
        try {
          // Always load roadmap structure from local data
          const roadmaps: DetailedRoadmap = roadmapData;
          const currentRoadmap: RoadmapData = roadmaps[slug];
          const currentResponse: Roadmaps = slugData.roadmaps.filter(
            (title) => title.slug === slug
          )[0];

          setRoadmap(currentRoadmap);
          setResponse(currentResponse);

          // Only fetch progress if user is authenticated
          if (isAuthenticated()) {
            try {
              const token = getToken();
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/progress/${slug}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.success) {
                setCompletedItems(response.data.data.completedItems);
                console.log("Progress loaded from API");
              }
            } catch (error) {
              console.error("Error fetching progress from API:", error);
              setSyncError("Failed to load your progress from the server");
              setTimeout(() => setSyncError(null), 5000);
            }
          }
        } catch (error) {
          console.error("Error loading roadmap data:", error);
        } finally {
          setIsLoaded(true);
        }
      }
    }

    loadData();
  }, []);

  // Save progress when it changes (only for authenticated users)
  useEffect(() => {
    if (isLoaded && isAuthenticated() && Object.keys(completedItems).length > 0) {
      // Debounce API saving
      const saveToAPI = async () => {
        try {
          setIsSaving(true);
          setSyncError(null);

          const token = getToken();
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/progress/${slug}`,
            { completedItems },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Progress saved to API");
        } catch (error) {
          console.error("Error saving progress to API:", error);
          setSyncError("Failed to save your progress to the server");
          setTimeout(() => setSyncError(null), 5000);
        } finally {
          setIsSaving(false);
        }
      };

      const timeoutId = setTimeout(() => {
        saveToAPI();
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [completedItems]);

  // Toggle item completion
  const toggleItemCompletion = (
    level: string,
    tech: string,
    topic: string,
    item: string
  ) => {
    // Show login prompt if not authenticated
    if (!isAuthenticated()) {
      setShowAuthPrompt(true);
      setTimeout(() => setShowAuthPrompt(false), 3000);
      return;
    }

    setCompletedItems((prev) => {
      const updated = { ...prev };

      // Initialize nested objects if they don't exist
      if (!updated[level]) updated[level] = {};
      if (!updated[level][tech]) updated[level][tech] = {};
      if (!updated[level][tech][topic]) updated[level][tech][topic] = {};

      // Toggle the completion status
      updated[level][tech][topic][item] = !updated[level][tech][topic][item];

      return updated;
    });
  };

  // Check if an item is completed
  const isItemCompleted = (
    level: string,
    tech: string,
    topic: string,
    item: string
  ): boolean => {
    return !!completedItems[level]?.[tech]?.[topic]?.[item];
  };

  // Check if a topic is fully completed (all items completed)
  const isTopicCompleted = (
    level: string,
    tech: string,
    topic: string
  ): boolean => {
    if (!roadmap) return false;

    const items = roadmap[level][tech][topic];
    if (!items || items.length === 0) return false;

    // Check if all items in the topic are completed
    return items.every((item) => isItemCompleted(level, tech, topic, item));
  };

  // Mark all items in a topic as completed or not completed
  const toggleAllItemsInTopic = (
    level: string,
    tech: string,
    topic: string,
    completed: boolean
  ) => {
    // Show login prompt if not authenticated
    if (!isAuthenticated()) {
      setShowAuthPrompt(true);
      setTimeout(() => setShowAuthPrompt(false), 3000);
      return;
    }

    if (!roadmap) return;

    setCompletedItems((prev) => {
      const updated = { ...prev };

      // Initialize nested objects if they don't exist
      if (!updated[level]) updated[level] = {};
      if (!updated[level][tech]) updated[level][tech] = {};
      if (!updated[level][tech][topic]) updated[level][tech][topic] = {};

      // Set all items to the given completion status
      roadmap[level][tech][topic].forEach((item) => {
        updated[level][tech][topic][item] = completed;
      });

      return updated;
    });
  };

  // Calculate progress percentage for the entire roadmap
  const calculateOverallProgress = (): number => {
    if (!roadmap || !isAuthenticated()) return 0;

    let totalItems = 0;
    let completedCount = 0;

    // Count total items and completed items
    Object.keys(roadmap).forEach((level) => {
      Object.keys(roadmap[level]).forEach((tech) => {
        Object.keys(roadmap[level][tech]).forEach((topic) => {
          const items = roadmap[level][tech][topic];
          totalItems += items.length;

          items.forEach((item) => {
            if (isItemCompleted(level, tech, topic, item)) {
              completedCount++;
            }
          });
        });
      });
    });

    return totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
  };

  // Force sync with server
  const syncWithServer = async () => {
    if (!isAuthenticated()) {
      setShowAuthPrompt(true);
      setTimeout(() => setShowAuthPrompt(false), 3000);
      return;
    }

    try {
      setIsSaving(true);
      setSyncError(null);
      setSyncSuccess(null);

      const token = getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/progress/${slug}`,
        { completedItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show success message
      setSyncSuccess("Your progress has been saved to the server");
      setTimeout(() => setSyncSuccess(null), 3000);
    } catch (error) {
      console.error("Error syncing progress:", error);
      setSyncError("Failed to sync your progress with the server");
      setTimeout(() => setSyncError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading or error state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a20] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mb-4"></div>
          <p className="text-slate-300">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap || !response) {
    return <ErrorPage />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a20] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl"></div>
        <div className="absolute top-60 left-1/4 w-64 h-64 rounded-full bg-pink-600/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 pt-8 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold py-6 sm:py-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              {response.title} Roadmap
            </h1>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
              Follow this step-by-step guide to master {response.title}. Track your progress and build your skills systematically.
            </p>
          </motion.div>

          {/* Authentication Prompt */}
          {showAuthPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-yellow-900/20 border border-yellow-500/30 text-yellow-300 backdrop-blur-md flex items-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              <span>
                Please{" "}
                <Link
                  href="/login"
                  className="underline font-medium hover:text-yellow-200 transition-colors"
                >
                  log in
                </Link>{" "}
                to track your progress
              </span>
            </motion.div>
          )}

          {/* Authentication Status & Sync Button */}
          <div className="mb-6 p-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-slate-300">
                {isAuthenticated() ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Your progress is being saved to your account</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span>
                      <Link
                        href="/login"
                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                      >
                        Log in
                      </Link>{" "}
                      to track your progress across devices
                    </span>
                  </span>
                )}
              </div>

              {isAuthenticated() && (
                <Button
                  onClick={syncWithServer}
                  disabled={isSaving}
                  className="text-sm font-medium border-blue-500/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all hover:scale-105"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-blue-500/30 border-t-blue-500/80 animate-spin mr-2"></div>
                      Syncing...
                    </>
                  ) : (
                    <>Sync Progress</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Error and Success Messages */}
          {syncError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 backdrop-blur-md flex items-center gap-2"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>{syncError}</span>
            </motion.div>
          )}

          {syncSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-900/20 border border-green-500/30 text-green-300 backdrop-blur-md flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>{syncSuccess}</span>
            </motion.div>
          )}

          {/* Overall Progress Bar - Only show if authenticated */}
          {isAuthenticated() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8 p-5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm font-medium">Overall Progress</span>
                <span className="text-white font-bold px-3 py-1 bg-white/10 rounded-md text-sm">
                  {calculateOverallProgress()}%
                </span>
              </div>
              <div className="w-full bg-gray-800/80 rounded-full h-3 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateOverallProgress()}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                ></motion.div>
              </div>
            </motion.div>
          )}

          {/* Login prompt when not authenticated */}
          {!isAuthenticated() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-10 p-6 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-md"
            >
              <h3 className="text-xl font-bold text-white mb-3">Track Your Learning Journey</h3>
              <p className="text-slate-300 mb-5">
                Sign in to save your progress, track completed topics, and continue your learning journey from any device.
              </p>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 transition-all">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In to Track Progress
                </Button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Levels */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {Object.keys(roadmap).map((level, index) => {
            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="mb-10"
              >
                <div className="flex justify-center">
                  <div className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300 px-6 py-6 rounded-2xl w-[90%] sm:w-[80%] md:w-[80%] lg:w-[60%] mx-auto shadow-lg shadow-black/10 hover:shadow-blue-900/10">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3 mb-5">
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      <h2 className="font-sans text-white text-xl font-bold">{level}</h2>
                    </div>

                    {/* Tech */}
                    <div className="mt-4 flex flex-col md:flex-row gap-3 justify-center md:items-center">
                      {Object.keys(roadmap[level]).map((tech, techIndex) => {
                        return (
                          <React.Fragment key={tech}>
                            <Drawer>
                              <DrawerTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="hover:bg-white/10 bg-white/5 text-white hover:text-white border border-white/10 hover:border-blue-400/50 transition-all duration-300 shadow-md hover:shadow-blue-500/10 p-4 h-auto"
                                >
                                  <div className="flex flex-col w-full">
                                    <span className="text-base font-medium">{tech}</span>
                                  </div>
                                </Button>
                              </DrawerTrigger>
                              <DrawerContent className="bg-[#0f0f2c] border-t border-white/10 rounded-t-2xl">
                                <div className="max-w-3xl mx-auto px-4 py-6">
                                  <DrawerHeader className="mb-4 pb-2 border-b border-white/10">
                                    <DrawerTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                                      {tech} Topics
                                    </DrawerTitle>
                                    <DrawerDescription className="text-center text-slate-400 mt-2">
                                      Master these topics to complete this section
                                    </DrawerDescription>
                                  </DrawerHeader>

                                  <div className="space-y-6">
                                    {Object.keys(roadmap[level][tech]).map((topic, topicIndex) => {
                                      const isAllItemsCompleted = isTopicCompleted(level, tech, topic);

                                      return (
                                        <motion.div
                                          key={topic}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.05 * topicIndex }}
                                        >
                                          <div
                                            className={`border rounded-xl p-5 backdrop-blur-md transition-all duration-300 ${
                                              isAuthenticated() && isAllItemsCompleted
                                                ? "border-green-500/30 bg-gradient-to-br from-green-900/20 to-green-900/10 shadow-lg shadow-green-900/10"
                                                : "border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-lg shadow-black/5"
                                            }`}
                                          >
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
                                              <h3 className="font-bold text-xl text-white capitalize">
                                                {topic}
                                              </h3>
                                              {isAuthenticated() ? (
                                                <Button
                                                  onClick={() =>
                                                    toggleAllItemsInTopic(
                                                      level,
                                                      tech,
                                                      topic,
                                                      !isAllItemsCompleted
                                                    )
                                                  }
                                                  className={`${
                                                    isAllItemsCompleted
                                                      ? "bg-green-600 hover:bg-green-700 text-white"
                                                      : "bg-white/10 hover:bg-white/20 text-white"
                                                  } text-sm px-4 transition-all`}
                                                >
                                                  {isAllItemsCompleted
                                                    ? "Mark All Incomplete"
                                                    : "Mark All Complete"}
                                                </Button>
                                              ) : (
                                                <Link href="/login">
                                                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm px-4 transition-all">
                                                    <LogIn className="w-4 h-4 mr-2" /> Sign In to Track
                                                  </Button>
                                                </Link>
                                              )}
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                              {roadmap[level][tech][topic].map((item: string) => {
                                                const isCompleted = isItemCompleted(level, tech, topic, item);

                                                return (
                                                  <button
                                                    key={item}
                                                    onClick={() =>
                                                      toggleItemCompletion(level, tech, topic, item)
                                                    }
                                                    className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all transform hover:scale-105 ${
                                                      isAuthenticated() && isCompleted
                                                        ? "bg-green-500/20 text-green-300 border border-green-400/30 hover:bg-green-500/30 shadow-md shadow-green-900/10"
                                                        : "bg-blue-500/10 text-blue-300 border border-blue-400/20 hover:bg-blue-500/20 shadow-md shadow-blue-900/5"
                                                    }`}
                                                  >
                                                    {isAuthenticated() && isCompleted && (
                                                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                                    )}
                                                    <span>{item}</span>
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    })}
                                  </div>

                                  <DrawerFooter className="mt-8 pt-4 border-t border-white/10">
                                    <DrawerClose>
                                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white">
                                        Close
                                      </Button>
                                    </DrawerClose>
                                  </DrawerFooter>
                                </div>
                              </DrawerContent>
                            </Drawer>
                            {techIndex < Object.keys(roadmap[level]).length - 1 && (
                              <>
                                <div className="hidden md:flex text-blue-400">
                                  <MoveRight className="w-6 h-6" />
                                </div>
                                <div className="md:hidden text-blue-400 flex justify-center items-center my-2">
                                  <MoveDown className="w-6 h-6" />
                                </div>
                              </>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Only show arrow if not the last level */}
                {index < Object.keys(roadmap).length - 1 && (
                  <div className="flex text-blue-400 justify-center my-8">
                    <MoveDown className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            );
          })}

          <div className="flex justify-center mt-12 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="px-4 py-3 w-full sm:w-[60%] md:w-[50%] mx-auto"
            >
              <Link href="/roadmaps">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-medium rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all">
                  Explore Other Tech Stacks
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}