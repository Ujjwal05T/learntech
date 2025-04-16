'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Check password strength when password changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength('weak');
      return;
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = 
      [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars]
        .filter(Boolean).length;
    
    if (strength < 3) {
      setPasswordStrength('weak');
    } else if (strength === 3) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  const validateForm = () => {
    // Reset error
    setError(null);
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Validate OTP - assuming it's 6 digits
    if (!/^\d{6}$/.test(formData.otp)) {
      setError('Please enter a valid 6-digit OTP');
      return false;
    }
    
    // Validate password
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make API request to reset password
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.password
        }
      );
      
      if (response.data.success) {
        setSuccess(true);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'An error occurred');
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
      console.error('Reset password error:', error);
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
              Enter the OTP sent to your email along with your new password.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">
                  One-Time Password (OTP)
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="6-digit code"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                />
                {passwordStrength && (
                  <div className="mt-1">
                    <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' : 
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' : 
                          'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                    <p className={`text-xs mt-1 ${
                      passwordStrength === 'weak' ? 'text-red-400' : 
                      passwordStrength === 'medium' ? 'text-yellow-400' : 
                      'text-green-400'
                    }`}>
                      {passwordStrength === 'weak' ? 'Weak password' : 
                       passwordStrength === 'medium' ? 'Medium strength' : 
                       'Strong password'}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
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
                  'Reset Password'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-400">
                Didn't receive the code? Request again
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
            <h2 className="text-xl font-semibold text-white mb-2">Password Reset Successful</h2>
            <p className="text-gray-300">
              Your password has been reset successfully.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Redirecting you to the login page...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}