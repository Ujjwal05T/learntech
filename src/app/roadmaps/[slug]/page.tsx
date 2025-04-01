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
import { MoveDown, MoveRight, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";

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

  // Load data and state on mount
  useEffect(() => {
    if (slug) {
      const roadmaps: DetailedRoadmap = roadmapData;
      const currentRoadmap: RoadmapData = roadmaps[slug];
      const currentResponse: Roadmaps = slugData.roadmaps.filter(
        (title) => title.slug === slug
      )[0];

      setRoadmap(currentRoadmap);
      setResponse(currentResponse);

      // Load saved progress
      const savedProgress = localStorage.getItem(
        `roadmap-items-progress-${slug}`
      );
      if (savedProgress) {
        setCompletedItems(JSON.parse(savedProgress));
      }

      setIsLoaded(true);
    }
  }, [slug]);

  // Save progress when it changes
  useEffect(() => {
    if (isLoaded && Object.keys(completedItems).length > 0) {
      localStorage.setItem(
        `roadmap-items-progress-${slug}`,
        JSON.stringify(completedItems)
      );
    }
  }, [completedItems, slug, isLoaded]);

  // Toggle item completion
  const toggleItemCompletion = (
    level: string,
    tech: string,
    topic: string,
    item: string
  ) => {
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
    if (!roadmap) return 0;

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

  // Show loading or error state
  if (!isLoaded) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!roadmap || !response) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="bg-black pt-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-2xl text-white font-bold py-6 sm:py-8">
            {response.title} Roadmap
          </div>

          {/* Overall Progress Bar - ONLY THIS PROGRESS BAR IS SHOWN */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white text-sm">Overall Progress</span>
              <span className="text-white text-sm font-bold">
                {calculateOverallProgress()}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${calculateOverallProgress()}%` }}></div>
            </div>
          </div>
        </div>

        {/* Levels */}
        <div>
          {Object.keys(roadmap).map((level) => {
            return (
              <div key={level}>
                <div className="flex justify-center">
                  <div className="border-2 border-slate-700 bg-slate-800/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 px-4 py-3 text-lg rounded-lg w-[90%] sm:w-[70%] md:w-[80%] lg:w-[60%] mx-2 sm:mx-auto hover:shadow-blue-500/10">
                    <div className="font-sans text-white text-xl mb-2">
                      <h1>{level}</h1>
                    </div>
                    {/* Tech */}
                    <div className="mt-2 flex flex-col md:flex-row gap-2 justify-center md:items-center">
                      {Object.keys(roadmap[level]).map((tech) => {
                        return (
                          <React.Fragment key={tech}>
                            <Drawer>
                              <DrawerTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="hover:bg-slate-700/50 bg-blue-500/10 text-white hover:text-white border border-slate-600 hover:border-blue-400/50 transition-colors duration-300">
                                  <div className="flex flex-col w-full">
                                    <span>{tech}</span>
                                  </div>
                                </Button>
                              </DrawerTrigger>
                              <DrawerContent className="bg-slate-900 border-t border-slate-700">
                                <div className="max-w-3xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
                                  <DrawerHeader className="mb-2 sm:mb-4">
                                    <DrawerTitle className="text-lg sm:text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                                      {tech} Topics
                                    </DrawerTitle>
                                  </DrawerHeader>

                                  <div className="space-y-4 sm:space-y-6">
                                    {Object.keys(roadmap[level][tech]).map(
                                      (topic) => {
                                        const isAllItemsCompleted =
                                          isTopicCompleted(level, tech, topic);

                                        return (
                                          <DrawerDescription
                                            key={topic}
                                            className="text-slate-400">
                                            <div
                                              className={`border rounded-lg p-3 sm:p-4 backdrop-blur-sm ${
                                                isAllItemsCompleted
                                                  ? "border-green-500/30 bg-green-900/10"
                                                  : "border-slate-700 bg-slate-800/50"
                                              }`}>
                                              <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-lg text-white capitalize">
                                                  {topic}
                                                </h3>
                                                <Button
                                                  size="sm"
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
                                                      ? "bg-green-600 hover:bg-green-700"
                                                      : "bg-slate-700 hover:bg-slate-600"
                                                  } text-xs px-3`}>
                                                  {isAllItemsCompleted
                                                    ? "Mark All Incomplete"
                                                    : "Mark All Complete"}
                                                </Button>
                                              </div>

                                              <div className="flex flex-wrap gap-2">
                                                {roadmap[level][tech][
                                                  topic
                                                ].map((item: string) => {
                                                  const isCompleted =
                                                    isItemCompleted(
                                                      level,
                                                      tech,
                                                      topic,
                                                      item
                                                    );

                                                  return (
                                                    <button
                                                      key={item}
                                                      onClick={() =>
                                                        toggleItemCompletion(
                                                          level,
                                                          tech,
                                                          topic,
                                                          item
                                                        )
                                                      }
                                                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                                                        isCompleted
                                                          ? "bg-green-500/10 text-green-400 border border-green-400/30 hover:bg-green-500/20"
                                                          : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                                      }`}>
                                                      {isCompleted && (
                                                        <CheckCircle className="w-3 h-3" />
                                                      )}
                                                      {item}
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          </DrawerDescription>
                                        );
                                      }
                                    )}
                                  </div>

                                  <DrawerFooter className="mt-4">
                                    <DrawerClose>
                                      <Button className="w-full">Close</Button>
                                    </DrawerClose>
                                  </DrawerFooter>
                                </div>
                              </DrawerContent>
                            </Drawer>
                            <div className="hidden md:flex text-slate-400">
                              <MoveRight className="w-5 h-5" />
                            </div>
                            <div className="md:hidden text-slate-400 flex justify-center items-center m-1">
                              <MoveDown className="w-5 h-5" />
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Only show arrow if not the last level */}
                {Object.keys(roadmap).indexOf(level) <
                  Object.keys(roadmap).length - 1 && (
                  <div className="flex text-slate-400 justify-center my-6">
                    <MoveDown className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-center mt-6 sm:mt-12 pb-8">
            <div className="px-4 py-3 w-full sm:w-[60%] md:w-[50%] mx-auto">
              <Link href="/roadmaps">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                  Explore Other Tech Stacks
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}