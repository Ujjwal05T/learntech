"use client";
import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Code,
  Trophy,
  Mail,
  HandshakeIcon,
  Zap,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const LandingPage = () => {
  const [currentView, setCurrentView] = useState("student"); // 'student' or 'company'

  const toggleView = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* View Switcher */}
      <ViewSwitcher currentView={currentView} onToggle={toggleView} />

      {/* Conditional Content */}
      {currentView === "student" ? <StudentView /> : <CompanyView />}
    </div>
  );
};

// View Switcher Component
const ViewSwitcher = ({ currentView, onToggle }: { currentView: string; onToggle: (view: string) => void }) => {
  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-full p-1 px-2 shadow-2xl backdrop-blur-sm">
        <div className="flex">
          <button
            onClick={() => onToggle("student")}
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 transform ${
              currentView === "student"
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}>
            <Users size={18} className="hidden sm:block" />
            Student
          </button>
          <button
            onClick={() => onToggle("company")}
            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 transform ${
              currentView === "company"
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}>
            <Building2 size={18} className="hidden sm:block" />
            Company
          </button>
        </div>
      </div>
    </div>
  );
};

// Student View Component
const StudentView = () => {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Roadmaps",
      description: "Step-by-step guides for tech careers and education.",
      stats: "20+ Career Paths",
    },
    {
      title: "Expert Talks",
      description: "Learn from industry pros through live sessions and AMAs.",
      stats: "Weekly Sessions",
    },
    {
      title: "Trends & News",
      description: "Stay updated with curated tech insights and announcements.",
      stats: "Daily Updates",
    },
    {
      title: "Hackathons & Internships",
      description: "Earn real-world experience through exclusive events.",
      stats: "Monthly Events",
    },
  ];

  const upcomingEvents = [
    {
      title: "Summer Hackathon",
      date: "31 May, 2025",
      type: "Hackathon",
      slots: "Open for registration",
    },
    {
      title: "Aptitude Test ",
      date: "June 14, 2025",
      type: "Test",
      slots: "Available for all",
    },
    {
      title: "Miscellaneous events ",
      date: "May-June",
      type: "Events",
      slots: "Team and Single events",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://formspree.io/f/xdkeaawn", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
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
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a20] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-600/20 blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10 max-w-6xl">
        {mounted && (
          <div className="space-y-32">
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8 py-12">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Your Career Starts Here
              </h1>
              <p className="text-lg text-gray-300">
                Explore personalized roadmaps, connect with experts, and
                discover career-starting opportunities.
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/roadmaps">
                  <Button className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
                    Explore Roadmaps
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="px-8 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white/20">
                    Join the Community
                  </Button>
                </Link>
              </div>
            </motion.section>

            {/* Feature Highlights */}
            <motion.section
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map(({ title, description, stats }) => (
                <motion.div
                  key={title}
                  variants={item}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 shadow-xl transform hover:scale-105 transition-all">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {title}
                  </h3>
                  <p className="text-slate-300 mb-6 text-lg">{description}</p>
                  <span className="text-sm font-medium px-4 py-2 rounded-full bg-white/5 text-blue-400">
                    {stats}
                  </span>
                </motion.div>
              ))}
            </motion.section>

            {/* Upcoming Events with more details */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 mb-14">
              <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text text-center">
                Upcoming Events & Opportunities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.title}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl">
                    <span className="text-sm text-blue-400 mb-4 block">
                      {event.type}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-gray-400">
                      <p>{event.date}</p>
                      <p className="text-sm">{event.slots}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        )}

        <footer className="bg-[#070714]/80 backdrop-blur-md border-t border-white/10 mt-14 ">
          <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Learnext</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Rajendra Nagar
                  <br />
                  Indore, 402012
                  <br />
                  Madhya Pradesh
                  <br />
                  India
                </p>
                <p className="text-gray-400 text-sm">
                  Email: info@learnext.live <br />
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link
                      href="/#"
                      className="hover:text-blue-400 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/roadmaps"
                      className="hover:text-blue-400 transition-colors">
                      Roadmaps
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-blue-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#"
                      className="hover:text-blue-400 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact Form */}
              <div className="space-y-4 lg:col-span-2">
                <h3 className="text-xl font-semibold text-white">
                  Get in Touch
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitStatus === "success" && (
                    <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-md text-green-300">
                      Thank you! Your message has been sent successfully.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-300">
                      Sorry, there was a problem sending your message. Please
                      try again.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                      className="bg-white/5 border-white/10 text-white"
                      disabled={isSubmitting}
                      required
                    />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      className="bg-white/5 border-white/10 text-white"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Message"
                    className="bg-white/5 border-white/10 text-white h-24"
                    disabled={isSubmitting}
                    required
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all">
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Social Links & Copyright */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                {/* <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaDiscord size={24} />
              </a>
            </div> */}
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Learnext. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const CompanyView = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://formspree.io/f/xdkeaawn", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
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
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold text-white mb-6">
            Find Tomorrow&apos;s <span className="text-indigo-400">Tech Talent</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Partner with Learnext to discover passionate developers through
            hackathons. Connect with pre-vetted talent who&apos;ve proven their
            skills in real projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
              Partner With Us
            </button>
            <button
            onClick={() => document.getElementById('success-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="border-2 border-indigo-400 text-indigo-400 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-400 hover:text-white transition-colors">
              View Success Stories
            </button>
          </div>
        </div>

        {/* Pain Points & Solution */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-red-400" />
                The Challenge
              </h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Traditional hiring takes months and costs thousands
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Resumes don&apos;t show real coding abilities
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Hard to find passionate, motivated developers
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-green-400" />
                Our Solution
              </h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  See developers build real projects in hackathons
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Access to pre-vetted, passionate talent
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Faster hiring with portfolio-backed candidates
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <Users className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Talent Pipeline
            </h3>
            <p className="text-gray-400 text-sm">1000+ motivated developers</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <Code className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Project-Based
            </h3>
            <p className="text-gray-400 text-sm">
              Real projects, not just interviews
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <Trophy className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Sponsorship
            </h3>
            <p className="text-gray-400 text-sm">
              Brand visibility + talent access
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <HandshakeIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Custom Match
            </h3>
            <p className="text-gray-400 text-sm">
              Specific skills for your needs
            </p>
          </div>
        </div>

        {/* Hackathon Showcase */}
        {/* <div id='success-section' className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Success Stories & Projects
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 h-32 rounded-lg flex items-center justify-center border border-gray-600">
              <span className="text-white font-medium">Hackathon Event</span>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-800 h-32 rounded-lg flex items-center justify-center border border-gray-600">
              <span className="text-white font-medium">Team Building</span>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-blue-800 h-32 rounded-lg flex items-center justify-center border border-gray-600">
              <span className="text-white font-medium">Awards Ceremony</span>
            </div>
          </div>

         
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((project) => (
              <div
                key={project}
                className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-650 transition-colors">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-800 h-20 rounded mb-3 flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">
                  Project {project}
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  Built in 48 hours. Developer hired by Fortune 500 company.
                </p>
                <div className="text-xs text-gray-400">React • Node.js</div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Contact Form */}
        <div id="contact-section" className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">
            Partner With Us
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Ready to discover exceptional talent? Let&apos;s discuss your hiring needs.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            {submitStatus === "success" && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center">
          <strong>Thank you!</strong> We&apos;ll get back to you within 24 hours to discuss your partnership.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center">
          <strong>Oops!</strong> There was a problem sending your message. Please try again or contact us directly.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Company Name *</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your company name"
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-12"
            disabled={isSubmitting}
            required
          />
              </div>
              
              <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Business Email *</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.name@company.com"
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-12"
            disabled={isSubmitting}
            required
          />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Tell us about your hiring needs *</label>
              <Textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="What roles are you looking to fill? What skills are most important? How many developers do you need?"
          className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-32 resize-none"
          disabled={isSubmitting}
          required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50">
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Sending Request...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Start Partnership Discussion
            </div>
          )}
              </Button>
              
              <div className="flex items-center justify-center text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            Response within 24h
          </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
