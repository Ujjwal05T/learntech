"use client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaEnvelope,
  FaUser,
  FaBriefcase,
  FaPhone,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaLock,
} from "react-icons/fa";

interface Company {
  _id?: string;
  companyName: string;
  companyEmail: string;
  contactPerson: {
    fullName: string;
    position: string;
    contact: string;
  };
}

function CompanyUpdatePage() {
  const router = useRouter();
  const [company, setCompany] = useState<Company>({
    companyName: "",
    companyEmail: "",
    contactPerson: {
      fullName: "",
      position: "",
      contact: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/company/get-company`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const companyData = response.data.data;
        setCompany(companyData.company);
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          setError("Error retrieving company data.");
        } else {
          setError(`Error: ${error.message}`);
        }
        console.error("Failed to fetch company data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("contactPerson.")) {
      const field = name.split(".")[1];
      setCompany((prev) => ({
        ...prev,
        contactPerson: {
          ...prev.contactPerson,
          [field]: value,
        },
      }));
    } else {
      setCompany((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

      const { companyName, contactPerson } = company;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/company/update-company`,
        { companyName, contactPerson },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Company updated successfully!");
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
      console.error("Failed to update company:", err);
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
            Loading company details...
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
            onClick={() => router.push("/company")}
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Company</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Edit Company</h1>
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
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-300">{success}</p>
          </div>
        )}

        {/* Card */}
        <div className="bg-[#121418] rounded-xl p-6 shadow-xl border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-blue-400 border-b border-gray-700 pb-2">
                Company Information
              </h3>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    value={company.companyName}
                    onChange={handleInputChange}
                    className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company Email
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
                    name="companyEmail"
                    value={company.companyEmail}
                    disabled
                    className="pl-10 block w-full px-3 py-2 bg-[#141824] border border-gray-800 rounded-md shadow-sm text-gray-400 cursor-not-allowed opacity-80 sm:text-sm"
                    placeholder="company@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-blue-400 border-b border-gray-700 pb-2">
                Contact Person
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
                    name="contactPerson.fullName"
                    value={company.contactPerson.fullName}
                    onChange={handleInputChange}
                    className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Contact person's name"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Position
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="contactPerson.position"
                    value={company.contactPerson.position}
                    onChange={handleInputChange}
                    className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., HR Manager"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contact (Email / Phone)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="contactPerson.contact"
                    value={company.contactPerson.contact}
                    onChange={handleInputChange}
                    className="pl-10 block w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="email@domain.com / phone number"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className={`flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300 ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={saving}
              >
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

export default CompanyUpdatePage;
