'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make API request to your backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        { email }
      );
      
      if (response.data.success) {
        setSuccess(true);
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          router.push('/reset-password');
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to process your request');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'An error occurred');
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-xl"
      >
        <Link href="/" className="text-blue-500 hover:text-blue-400 flex items-center gap-1 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
        
        <h1 className="text-2xl font-bold text-white mb-6">Reset Your Password</h1>
        
        {!success ? (
          <>
            <p className="text-gray-300 mb-6">
              Enter your email address and we&apos;ll send you a one time password to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-400 text-sm py-2 px-3 bg-red-900/30 rounded-md">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-blue-500 hover:text-blue-400">
                Remember your password? Log in
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/30 text-green-500 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Check Your Email</h2>
            <p className="text-gray-300">
              We've sent one time password to <span className="font-medium text-blue-400">{email}</span>
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Redirecting you to the reset page...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}