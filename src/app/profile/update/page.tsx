"use client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCode,
  FaBook,
  FaUserCircle,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaLock,
} from "react-icons/fa";

function ProfileUpdatePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    collegeName: "",
    skills: [""],
    course: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/profile/get-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const profileData = response.data.data;
        setUser(profileData.profile);
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          setError(
            `Error Retrieving profile`
          );
        }  else {
          setError(`Error: ${error.message}`);
        }
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      skills: value ? value.split(",").map((skill) => skill.trim()) : [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/profile/update-profile`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setSuccess("Profile updated successfully!");

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const error = err as AxiosError;
      if (error.response) {
        setError(
          `Error ${error.response.status}: ${error.response.statusText}`
        );
      } else if (error.request) {
        setError("No response received from server. Please try again later.");
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error("Failed to update profile:", err);

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0b1018] to-[#1a1f2e] text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-blue-300">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1018] to-[#1a1f2e] text-white pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with back button */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300">
            <FaArrowLeft className="mr-2" />
            <span>Back to Profile</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg flex items-start">
            <FaTimes className="text-red-500 mt-1 mr-3 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-[#121418] rounded-xl p-6 shadow-xl border border-gray-700">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-[#1e2330]">
              {user.fullName ? (
                user.fullName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .toUpperCase()
              ) : (
                <FaUserCircle />
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two column layout for desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-400 border-b border-gray-700 pb-2">
                  Personal Information
                </h3>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleInputChange}
                      className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Username
                    <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">@</span>
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      disabled
                      className="pl-10 block w-full px-3 py-2 bg-[#141824] border border-gray-800 rounded-md shadow-sm text-gray-400 cursor-not-allowed opacity-80 sm:text-sm"
                      placeholder="Your username"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                    <span className="ml-2 text-xs text-gray-500">(Cannot be changed)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-500 h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      disabled
                      className="pl-10 block w-full px-3 py-2 bg-[#141824] border border-gray-800 rounded-md shadow-sm text-gray-400 cursor-not-allowed opacity-80 sm:text-sm"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-blue-400 border-b border-gray-700 pb-2">
                  Education & Skills
                </h3>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    College Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGraduationCap className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="collegeName"
                      value={user.collegeName}
                      onChange={handleInputChange}
                      className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your college or university"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Course
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBook className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="course"
                      value={user.course}
                      onChange={handleInputChange}
                      className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Your course of study"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Skills (comma separated)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCode className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name="skills"
                      value={user.skills.join(", ")}
                      onChange={handleSkillsChange}
                      className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="JavaScript, React, Python, etc."
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Separate skills with commas (e.g., JavaScript, React,
                    Python)
                  </p>
                </div>
              </div>
            </div>

            {/* Preview of skills as tags */}
            {user.skills.length > 0 && user.skills[0] !== "" && (
              <div className="mt-4">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#1a1f2e] text-blue-300 rounded-full text-sm mr-2 mb-2">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ProfileUpdatePage;
