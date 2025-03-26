'use client'
import LoadingScreen from '@/components/Loading';
import { useToken } from '@/hooks/useToken';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaGraduationCap, FaCode, FaLink, FaMedal, FaUser, FaEnvelope, FaPhone, FaBookOpen, FaSignOutAlt } from 'react-icons/fa';


export default function ProfilePage() {
  //temporary data
  const projects = ['Project 1', 'Project 2', 'Project 3'];
  const router = useRouter();
  const [user, setUser] = useState({
    // img: "img",
    fullName: "Loading...",
    username: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    collegeName: "Loading...",
    skills: ['a','b','c'],
    course: "Loading...",
    // project: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const { removeToken,isAuthenticated } = useToken();


  useEffect(() => {
    if (!isAuthenticated()) {
      setTimeout(() => {
        router.push("/login");
      }, 500); 
    } else {
      setAuthorized(true);
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get JWT token from localStorage or cookies
        const token = localStorage.getItem("token");

        if (!token) {
          // Redirect to login if no token is found
          router.push("/login");
          return;
        }

        // Fetch user data from backend API using axios
        const response = await axios.get(
          "http://localhost:5000/profile/get-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const profileData = response.data.data;
        console.log(profileData);
        setUser(profileData.profile);
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
          // If server sends response
          if (error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          setError(
            `Error ${error.response.status}: ${error.response.statusText}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          setError("No response received from server. Please try again later.");
        } else {
          // Something happened in setting up the request
          setError(`Error: ${error.message}`);
        }
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authorized) {
      fetchUserData();
    }
  }, [router, authorized]);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };
  if (!authorized) {
    return <LoadingScreen />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0b1018] to-[#1a1f2e] text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-blue-300">Loading your profile...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0b1018] text-white">
        <div className="p-8 border-2 border-red-500 rounded-xl bg-[#121418]">
          <h1 className="text-xl font-bold text-red-500">Error Loading Profile</h1>
          <p className="mt-4">{error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1018] to-[#1a1f2e] text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-[#121418] rounded-xl p-6 mb-8 shadow-xl border border-gray-700">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-[#1e2330]">
                {/* {user.fullName.split(' ').map(name => name[0]).join('')}
                 */}
                 img
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold">{user.fullName}</h1>
              <p className="text-blue-400 text-lg">@{user.username}</p>
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center text-gray-300">
                  <FaEnvelope className="mr-2" /> {user.email}
                </div>
                <div className="flex items-center text-gray-300">
                  <FaPhone className="mr-2" /> {user.phone}
                </div>
                <div className="flex items-center text-gray-300">
                  <FaBookOpen className="mr-2" /> {user.course}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
  <div className="flex gap-2">
    <button
      onClick={() => router.push('/profile/update')}
      className="bg-[#1a1f2e] hover:bg-[#252a3d] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 border border-gray-700 shadow-md"
    >
      <FaUser className="text-blue-200" />
      <span>Edit Profile</span>
    </button>
    <button
      onClick={handleLogout}
      className="bg-[#1a1f2e] hover:bg-[#252a3d] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 border border-gray-700 shadow-md"
    >
      <FaSignOutAlt className="text-red-400" />
      <span>Logout</span>
    </button>
  </div>
</div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Education */}
            <div className="bg-[#121418] rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center mb-4">
                <FaGraduationCap className="text-2xl text-blue-500 mr-3" />
                <h2 className="text-xl font-bold">Education</h2>
              </div>
              <div className="p-4 bg-[#1a1f2e] rounded-lg">
                <p className="font-semibold text-blue-300">{user.collegeName}</p>
                <p className="text-sm text-gray-400 mt-1">{user.course}</p>
              </div>
            </div>

            {/* Resume */}
            <div className="bg-[#121418] rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center mb-4">
                <FaUser className="text-2xl text-blue-500 mr-3" />
                <h2 className="text-xl font-bold">Resume</h2>
              </div>
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resume
              </button>
            </div>
          </div>

          {/* Middle and Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Skills */}
            <div className="bg-[#121418] rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center mb-4">
                <FaCode className="text-2xl text-blue-500 mr-3" />
                <h2 className="text-xl font-bold">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-[#1a1f2e] text-blue-300 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-[#121418] rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center mb-4">
                <FaMedal className="text-2xl text-blue-500 mr-3" />
                <h2 className="text-xl font-bold">Certificates</h2>
              </div>
              <div className="p-4 bg-[#1a1f2e] rounded-lg text-center">
                <p className="text-gray-300">
                  You do not have any certificates. 
                  <button className="text-blue-400 hover:text-blue-300 ml-1 underline focus:outline-none">
                    Go learn something
                  </button>
                </p>
              </div>
            </div>

            {/* Projects */}
            <div className="bg-[#121418] rounded-xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <div className="flex items-center mb-4">
                <FaLink className="text-2xl text-blue-500 mr-3" />
                <h2 className="text-xl font-bold">Projects</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project, index) => (
                  <div key={index} className="p-4 bg-[#1a1f2e] rounded-lg hover:bg-[#252a3d] transition-colors duration-300">
                    <h3 className="font-semibold text-blue-300">{project}</h3>
                    <p className="text-sm text-gray-400 mt-1">Click to view details</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

