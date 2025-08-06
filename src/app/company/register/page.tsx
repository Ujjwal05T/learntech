"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {  Building2, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  companyName: string;
  companyEmail: string;
  personName: string;
  position: string;
  contactNumber: string;
}

export default function CompanyRegistrationPage() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyEmail: "",
    personName: "",
    position: "",
    contactNumber: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (
      !formData.companyName.trim() ||
      !formData.companyEmail.trim() ||
      !formData.personName.trim() ||
      !formData.position.trim() ||
      !formData.contactNumber.trim()
    ) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://formspree.io/f/xdkeaawn", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          formType: "Company Registration", // To distinguish from contact form
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          companyName: "",
          companyEmail: "",
          personName: "",
          position: "",
          contactNumber: "",
        });
      } else {
        setSubmitStatus("error");
        console.error("Form submission failed:", await response.text());
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 relative overflow-hidden">
      {/* Floating Animated Programming Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <motion.span
          className="absolute top-10 left-10 text-5xl font-mono font-bold text-indigo-300 opacity-20 blur-sm"
          initial={{ y: 0 }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'</>'}
        </motion.span>
        <motion.span
          className="absolute bottom-20 right-20 text-3xl font-mono font-semibold text-purple-300 opacity-15"
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          {`register()`}
        </motion.span>
        <motion.span
          className="absolute top-1/3 right-1/3 text-4xl font-mono font-bold text-pink-300 opacity-15 blur-sm"
          initial={{ x: 0 }}
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'// Welcome'}
        </motion.span>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Company <span className="text-indigo-400">Registration</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto">
              Join our talent network and discover exceptional developers for your team
            </p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className=" border border-gray-700 rounded-xl shadow-2xl p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center"
                >
                  <strong>Registration Successful!</strong> We&apos;ll contact you within 24 hours to discuss partnership opportunities.
                </motion.div>
              )}

              {/* Error Message */}
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center"
                >
                  <strong>Registration Failed!</strong> Please check all fields and try again.
                </motion.div>
              )}

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Company Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Company Name *
                    </label>
                    <Input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter your company name"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-12 text-base"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Company Email *
                    </label>
                    <Input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleInputChange}
                      placeholder="company@example.com"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-12 text-base"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  Contact Person Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="personName"
                      value={formData.personName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-12 text-base"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Position/Title *
                    </label>
                    <Input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="HR Manager, CTO, etc."
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-12 text-base"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Contact Number or Email
                  </label>
                  <Input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="john@example.com or +1234567890"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-12 text-base"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-base"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Registering Company...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Register Company
                    </div>
                  )}
                </Button>
              </div>

              {/* Additional Info */}
              <div className="text-center pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm mb-2">
                  By registering, you agree to our partnership terms
                </p>
                <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>We&apos;ll respond within 24 hours</span>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-gray-400 text-sm">
              Need help? Contact us at{" "}
              <a 
                href="mailto:info@learnext.live" 
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                info@learnext.live
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}