"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { useUserStore } from "@/../stores/user-store";
import Image from "next/image";
// import {  } from 'date-fns'

interface IEvent {
  title: string;
  description: string;
  date: Date;
  location?: string;
  organizer?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEventQuestion {
  _id?: string;
  username: string;
  question: string;
  answer?: string;
  isAnswered: boolean;
  upvotes: number;
  upvotedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function EventPage() {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<IEventQuestion[]>([]);
  const [askQuestion, setAskQuestion] = useState("");
  const [error, setError] = useState<string>("");
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
  const [answerText, setAnswerText] = useState<string>("");
  const [answeringQuestion, setAnsweringQuestion] = useState<string | null>(
    null
  );
  const [answerLoading, setAnswerLoading] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useUserStore();

  // Track upvote processing state to prevent double-clicks
  const [processingUpvote, setProcessingUpvote] = useState<string | null>(null);

  // Get token from localStorage but check if window is defined (SSR compatibility)
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const token = getToken();

  const showError = (message: string) => {
    setError(message);

    // Clear previous timeout if exists
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }

    // Auto-clear error after 5 seconds
    const timeout = setTimeout(() => {
      setError("");
    }, 5000);

    setErrorTimeout(timeout);
  };

  const fetchEvent = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setEvent(response.data[0]);
      } else {
        showError("No event found");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      showError("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data && response.data.length > 0) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      showError("Failed to load questions");
    }
  };

  const handleAskQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!askQuestion.trim()) {
      showError("Please enter a question");
      return;
    }

    if (!user) {
      showError("Please log in to ask a question");
      return;
    }

    try {
      setButtonLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/questions`,
        {
          username: user?.username || "User",
          question: askQuestion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Refresh questions after successfully posting
      await fetchQuestions();
      setAskQuestion(""); // Clear the input field
    } catch (error) {
      console.error("Error submitting question:", error);
      showError("Failed to submit question. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  // Fixed handleUpvote function with proper toggle functionality
  const handleUpvote = async (questionId: string) => {
    if (!user) {
      showError("Please log in to upvote");
      return;
    }

    if (processingUpvote) {
      return; // Prevent multiple simultaneous upvotes
    }

    // Set processing state
    setProcessingUpvote(questionId);

    try {
      // Find the question to check if user already upvoted
      const question = questions.find((q) => q._id === questionId);

      if (!question) {
        showError("Question not found");
        setProcessingUpvote(null);
        return;
      }

      const hasUpvoted = question.upvotedBy?.includes(user?.userId || "");

      // Optimistically update UI
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => {
          if (q._id === questionId) {
            if (hasUpvoted) {
              // Remove upvote
              return {
                ...q,
                upvotes: Math.max(0, q.upvotes - 1), // Ensure upvotes don't go below 0
                upvotedBy: q.upvotedBy.filter(
                  (username) => username !== user?.username
                ),
              };
            } else {
              // Add upvote
              return {
                ...q,
                upvotes: q.upvotes + 1,
                upvotedBy: [...(q.upvotedBy || []), user?.username || ""],
              };
            }
          }
          return q;
        })
      );

      // Make API call based on condition - FIXED ENDPOINTS
      if (hasUpvoted) {
        // If already upvoted, remove the upvote
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/remove-upvote`,
          { username: user?.username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // If not upvoted, add an upvote
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/upvote`,
          { username: user?.username },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      // Refresh questions to ensure data consistency
      await fetchQuestions();
    } catch (error) {
      console.error("Error handling upvote:", error);
      showError("Failed to process your vote");

      // Revert the optimistic update on error
      fetchQuestions();
    } finally {
      // Clear processing state
      setProcessingUpvote(null);
    }
  };

  const handleSubmitAnswer = async (questionId: string) => {
    if (!answerText.trim()) {
      showError("Please enter an answer");
      return;
    }

    try {
      setAnswerLoading(true);
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}/answer`,
        { answer: answerText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh questions to show the new answer
      await fetchQuestions();
      setAnswerText("");
      setAnsweringQuestion(null);
    } catch (error) {
      console.error("Error answering question:", error);
      showError("Failed to submit answer");
    } finally {
      setAnswerLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchQuestions();

    // Clear timeout on unmount
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, []);

  // Format date nicely
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a20] relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
        </div>

        <div className="p-4 max-w-md w-full relative z-10">
          <div className="flex flex-col items-center">
            {/* Branded loading spinner */}
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>

            <p className="text-blue-400 font-medium">
              Loading event details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!event && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a20] relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-red-600/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 shadow-xl max-w-lg w-full mx-4 relative z-10">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-3xl font-bold text-white mb-4">
              Event Not Found
            </h2>
            <p className="text-gray-300 mb-8">No active event was found</p>
            <button
              onClick={() => router.push("/home")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a20] relative overflow-hidden py-12 px-4">
      {/* Error message toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-xl shadow-lg max-w-md">
          {error}
        </motion.div>
      )}

      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-600/20 blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {event && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            {/* Event Banner Image with gradient overlay */}
            {event.imageUrl ? (
              <div className="h-80 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30 z-10"></div>
                {/* <img
                  src='/WhatsApp Image 2025-05-17 at 19.25.35_d823976a.jpg'
                  alt={event.title}
                  className="w-full h-[80%] sm:h-full object-cover"
                /> */}
                <Image src='/WhatsApp Image 2025-05-17 at 19.25.35_d823976a.jpg' alt={event.title} fill={true }   className="w-full h-full object-cover" />

               
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                      {event.title}
                    </h1>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${
                        event.isActive
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                      }`}>
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-gradient-to-r from-blue-600/30 to-indigo-600/30">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h1 className="text-3xl md:text-5xl font-bold text-white">
                    {event.title}
                  </h1>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      event.isActive
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                    }`}>
                    {event.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            )}

            <div className="p-8">
              {/* Event Details */}
              <div className="mb-10">
                <div className="prose max-w-none">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Event Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-600/20 rounded-lg mr-4">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">
                        Date & Time
                      </p>
                      <p className="text-white">{formatDate(event.date)}</p>
                    </div>
                  </div>
                </div>

                {event.location && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
                    <div className="flex items-start">
                      <div className="p-2 bg-purple-600/20 rounded-lg mr-4">
                        <svg
                          className="w-6 h-6 text-purple-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-1">
                          Location
                        </p>
                        <p className="text-white">{event.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg">
                    <div className="flex items-start">
                      <div className="p-2 bg-pink-600/20 rounded-lg mr-4">
                        <svg
                          className="w-6 h-6 text-pink-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-pink-400 font-medium uppercase tracking-wider mb-1">
                          Organizer
                        </p>
                        <p className="text-white">{event.organizer}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 pt-6 text-xs text-gray-400">
                <div className="flex justify-between flex-wrap gap-2">
                  <div>
                    Created: {new Date(event.createdAt).toLocaleString()}
                  </div>
                  <div>
                    Last Updated: {new Date(event.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Test Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 mb-8 sm:flex justify-center mx-auto hidden"
          >
          <div className="w-full max-w-5xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <p className="text-white text-lg mb-2 text-center w-full">
              To start the main test, click on the button below.
            </p>
            <p className="text-gray-300 text-base mb-6 text-center w-full">
              This test will assess your understanding of the event topics. Make sure you are ready before starting.
            </p>
            <button
              onClick={() => router.push("/test/main-test")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all border border-blue-400"
            >
              Start Test
            </button>
          </div>
        </motion.div> */}

        {/* Registration Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 mb-8 flex justify-center mx-auto">
          <div className="w-full max-w-5xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <div className="flex items-center mb-4">
              <svg
                className="w-8 h-8 text-purple-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                </path>
              </svg>
              <h2 className="text-2xl font-bold text-white">Hackathon Registration</h2>
            </div>
            <p className="text-gray-300 text-base mb-6 text-center max-w-lg">
              Don&apos;t miss your chance to participate in this exciting event! Register now to secure your spot and showcase your skills.
            </p>
            <a
              href="https://forms.gle/q7qkqtVUP2qvL9ueA" // Replace with your actual Google Form URL
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-md rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all border border-purple-400/30 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                </path>
              </svg>
              Fill Registration Form
            </a>
          </div>
        </motion.div> */}

        {/* Leaderboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 mb-8 flex justify-center mx-auto"
        >
          <div className="w-full max-w-5xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-8 flex flex-col items-center">
            <div className="flex items-center mb-4">
              <svg 
          className="w-8 h-8 text-yellow-400 mr-3" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg"
              >
          <path 
            fillRule="evenodd" 
            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l.707.707L15.414 4l.707-.707a1 1 0 111.414 1.414L16.828 5.414l.707.707a1 1 0 01-1.414 1.414L15.414 6.828l-.707.707A1 1 0 1113.293 6.12l.707-.707-1.414-1.414-.707.707A1 1 0 0112 2z" 
            clipRule="evenodd" 
          />
              </svg>
              <h2 className="text-2xl font-bold text-white"> Hack-Arambh Results Are Out!</h2>
            </div>
            
            <p className="text-gray-300 text-base mb-6 text-center max-w-lg">
              The wait is over! Hack-Arambh results have been officially announced. Discover the winners, and see how all participants performed in this incredible journey of innovation and creativity.
            </p>
            <button
              onClick={() => router.push("/hackathon-result")}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-md rounded-xl font-semibold shadow-lg hover:from-amber-600 hover:to-yellow-700 transition-all border border-amber-400/30 flex items-center transform hover:scale-105"
            >
              <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
              >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
              </svg>
              View Results
            </button>
          </div>
        </motion.div>

        {/* Questions and Answers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Q&A Forum
            </h2>
          </div>

          {/* Ask a question form */}
          <div className="p-6 bg-black/20">
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <label
                  htmlFor="question"
                  className="block text-sm font-medium text-blue-400 mb-2">
                  Ask a Question
                </label>
                <textarea
                  id="question"
                  value={askQuestion}
                  onChange={(e) => setAskQuestion(e.target.value)}
                  className="w-full rounded-xl bg-white/10 border border-white/10 p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What would you like to know about this event?"
                  rows={3}
                  required></textarea>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  disabled={!askQuestion.trim() || !user || buttonLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 disabled:opacity-50">
                  {user ? "Submit Question" : "Login to Ask"}
                </button>
              </div>
            </form>
          </div>

          {/* Questions list */}
          <div className="divide-y divide-white/10">
            {questions && questions.length > 0 ? (
              questions.map((question) => {
                // Check if current user has upvoted this question
                const hasUpvoted =
                  user && question.upvotedBy?.includes(user?.username || "");

                return (
                  <div
                    key={question._id}
                    className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-600/20 rounded-lg p-2">
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <h3 className="text-lg font-medium text-white">
                            {question.question}
                          </h3>
                          <div className="flex items-center mt-1 text-sm text-gray-400">
                            <span>Asked by {question.username}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(
                                question.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <span className="ml-auto flex items-center">
                              <button
                                onClick={() =>
                                  question._id && handleUpvote(question._id)
                                }
                                className={`flex items-center px-2 py-1 rounded transition-colors ${
                                  hasUpvoted
                                    ? "text-blue-400 bg-blue-900/20 hover:bg-blue-900/30"
                                    : "text-gray-400 hover:text-blue-400 hover:bg-blue-900/10"
                                } ${
                                  processingUpvote === question._id
                                    ? "opacity-50 cursor-wait"
                                    : ""
                                }`}
                                disabled={!user || processingUpvote !== null}
                                title={
                                  !user
                                    ? "Login to upvote"
                                    : processingUpvote !== null
                                    ? "Processing..."
                                    : hasUpvoted
                                    ? "Click to remove your upvote"
                                    : "Upvote this question"
                                }>
                                <svg
                                  className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                                    hasUpvoted
                                      ? "fill-blue-400 stroke-none transform scale-110"
                                      : "fill-none stroke-current"
                                  }`}
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 15l7-7 7 7"></path>
                                </svg>
                                <span>{question.upvotes}</span>
                              </button>
                            </span>
                          </div>
                        </div>

                        {user?.role === "admin" && (
                          <div className="mt-4">
                            {question.answer ? (
                              // If question is already answered, show edit option
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-green-400">
                                  This question has been answered
                                </span>
                                <button
                                  onClick={() => {
                                    setAnsweringQuestion(question._id || null);
                                    setAnswerText(question.answer || "");
                                  }}
                                  className="px-3 py-1 bg-white/10 text-blue-400 rounded-lg text-sm flex items-center hover:bg-white/20 transition-colors">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-10 10a2 2 0 01-2.828 0l-4-4a2 2 0 114.243-2.829L8 14.343l8.586-8.586z"></path>
                                  </svg>
                                  Edit Answer
                                </button>
                              </div>
                            ) : (
                              // If question is not answered, show answer button
                              <button
                                onClick={() => {
                                  setAnsweringQuestion(question._id || null);
                                  setAnswerText("");
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg text-sm font-medium flex items-center hover:from-green-700 hover:to-teal-700 transition-colors shadow-lg shadow-green-600/20">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                                </svg>
                                Answer This Question
                              </button>
                            )}

                            {/* Answer Form - Shows when answering */}
                            {answeringQuestion === question._id && (
                              <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                                <label
                                  htmlFor="answer"
                                  className="block text-sm font-medium text-blue-400 mb-2">
                                  {question.answer
                                    ? "Edit your answer"
                                    : "Your answer"}
                                </label>
                                <textarea
                                  id="answer"
                                  value={answerText}
                                  onChange={(e) =>
                                    setAnswerText(e.target.value)
                                  }
                                  className="w-full rounded-xl bg-white/10 border border-white/10 p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                  placeholder="Type your answer here..."
                                  required></textarea>

                                <div className="mt-4 flex justify-end space-x-3">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAnsweringQuestion(null);
                                      setAnswerText("");
                                    }}
                                    className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors">
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSubmitAnswer(question._id || "")
                                    }
                                    disabled={
                                      !answerText.trim() || answerLoading
                                    }
                                    className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 ${
                                      answerLoading
                                        ? "opacity-70 cursor-wait"
                                        : ""
                                    }`}>
                                    {answerLoading ? (
                                      <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing...
                                      </div>
                                    ) : question.answer ? (
                                      "Update Answer"
                                    ) : (
                                      "Submit Answer"
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {question.answer && (
                          <div className="mt-4 bg-white/5 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <svg
                                className="w-5 h-5 text-green-400 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span className="text-green-400 font-medium">
                                Answer from organizer
                              </span>
                            </div>
                            <p className="text-white">{question.answer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-500/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-lg">No questions have been asked yet</p>
                <p className="mt-2">
                  Be the first to ask a question about this event!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
