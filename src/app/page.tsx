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
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const [currentView, setCurrentView] = useState<string | null>(null);
  
  const toggleView = (view: string) => {
    setCurrentView(view);
    
    // Add smooth scroll with enhanced timing
    setTimeout(() => {
      const scrollTarget = window.innerHeight * 0.85;
      const startPosition = window.pageYOffset;
      const distance = scrollTarget - startPosition;
      const duration = 800; // 800ms for smooth animation
      let startTime: number | null = null;

      function animation(currentTime: number) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }

      // Easing function for smooth animation
      function ease(t: number, b: number, c: number, d: number) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* View Switcher - Always show */}
      <ViewSwitcher currentView={currentView} onToggle={toggleView} />

      {/* Conditional Content - Only render when a view is selected */}
      {currentView === "student" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <StudentView />
        </motion.div>
      )}
      {currentView === "company" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <CompanyView />
        </motion.div>
      )}
    </div>
  );
};

// View Switcher Component - Updated to handle null state
const ViewSwitcher = ({ currentView, onToggle }: { currentView: string | null; onToggle: (view: string) => void }) => {
  return (
    <div className="relative min-h-[100vh] w-full bg-gradient-to-br from-indigo-900 via-gray-900 to-slate-900 flex flex-col items-center justify-center overflow-hidden">      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>{/* Main content */}
      <div className="relative z-10 text-center mb-8 sm:mb-12 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
        >
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Learnext</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-12 px-2"
        >
          Choose your journey - whether you&apos;re a student looking to learn or an organization seeking talent
        </motion.p>
      </div>      {/* View switcher buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 flex flex-col justify-center sm:flex-row gap-4 sm:gap-6 px-4 w-full max-w-md sm:max-w-none mx-auto"
      >
        <button
          onClick={() => onToggle("student")}
          className={`group px-6 sm:px-8 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${
            currentView === "student"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
              : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          }`}>
          <Users size={20} className={`transition-colors ${currentView === "student" ? "text-white" : "text-indigo-400 group-hover:text-white"}`} />
          <span className="text-base sm:text-lg font-semibold">For Students</span>
        </button>
        <button
          onClick={() => onToggle("company")}
          className={`group px-6 sm:px-8 py-3 sm:py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto ${
            currentView === "company"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
              : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
          }`}>
          <Building2 size={20} className={`transition-colors ${currentView === "company" ? "text-white" : "text-indigo-400 group-hover:text-white"}`} />
          <span className="text-base sm:text-lg font-semibold">For Organizations</span>
        </button>
      </motion.div>  

      {currentView && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1 sm:p-2">
            <motion.div 
              animate={{ 
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-1 h-1 bg-white/50 rounded-full"
            />
          </div>
        </motion.div>
      )}

      
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0a0a20] relative overflow-hidden"
    >      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-blue-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full bg-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full bg-pink-600/20 blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative z-10 max-w-6xl">        {mounted && (
          <div className="space-y-16 sm:space-y-24 md:space-y-32">
            {/* Hero Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6 sm:space-y-8 py-8 sm:py-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text leading-tight">
                Your Career Starts Here
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4">
                Explore personalized roadmaps, connect with experts, and
                discover career-starting opportunities.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
                <Link href="/roadmaps">
                  <Button className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 text-sm sm:text-base">
                    Explore Roadmaps
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white/20 text-sm sm:text-base">
                    Join the Community
                  </Button>
                </Link>
              </div>
            </motion.section>            {/* Feature Highlights */}
            <motion.section
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {features.map(({ title, description, stats }) => (
                <motion.div
                  key={title}
                  variants={item}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl border border-white/10 shadow-xl transform hover:scale-105 transition-all">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
                    {title}
                  </h3>
                  <p className="text-slate-300 mb-4 sm:mb-6 text-base sm:text-lg">{description}</p>
                  <span className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-full bg-white/5 text-blue-400">
                    {stats}
                  </span>
                </motion.div>
              ))}
            </motion.section>            {/* Upcoming Events with more details */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 sm:space-y-12 mb-8 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text text-center px-4">
                Upcoming Events & Opportunities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.title}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl">
                    <span className="text-xs sm:text-sm text-blue-400 mb-3 sm:mb-4 block">
                      {event.type}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-gray-400 text-sm sm:text-base">
                      <p>{event.date}</p>
                      <p className="text-xs sm:text-sm">{event.slots}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
        )}

        <footer className="bg-[#070714]/80 backdrop-blur-md border-t border-white/10 mt-14 ">          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
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
          </div>        </footer>
      </div>
    </motion.div>
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
const router = useRouter();
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
  };  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 relative overflow-x-hidden"
    >
      {/* Floating Animated Programming Puns in Background */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <motion.span
          className="absolute top-10 left-10 text-5xl font-mono font-bold text-indigo-300 opacity-30 blur-sm"
          initial={{ y: 0 }}
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'</>'}
        </motion.span>
        <motion.span
          className="absolute bottom-20 right-20 text-3xl font-mono font-semibold text-purple-300 opacity-20"
          initial={{ y: 0 }}
          animate={{ y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          {`Hello_World('print')`}
        </motion.span>
        <motion.span
          className="absolute top-1/ left-1/3 text-4xl font-mono font-bold text-pink-300 opacity-20 blur-sm"
          initial={{ x: 0 }}
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'missing ;'}
        </motion.span>
        <motion.span
          className="absolute bottom-1/3 left-2/5 text-3xl font-mono font-semibold text-blue-300 opacity-20"
          initial={{ y: 0 }}
          animate={{ y: [25, 45, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'{debug: true}'}
        </motion.span>
        <motion.span
          className="absolute top-1/4 right-1/4 text-4xl font-mono font-bold text-green-300 opacity-20 blur-sm"
          initial={{ x: 0 }}
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        >
          {'// TODO: Coffee'}
        </motion.span>
      </div>      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center py-12 sm:py-16 md:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Find Tomorrow&apos;s <span className="text-indigo-400">Tech Talent</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Partner with Learnext to discover passionate developers through
            hackathons. Connect with pre-vetted talent who&apos;ve proven their
            skills in real projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <button 
              onClick={() =>  router.push('/company/register')}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-700 transition-colors">
              Partner With Us
            </button>
            <button
            onClick={() => {
              const targetElement = document.getElementById('events-gallery-title');
              if (targetElement) {
                // Get the absolute position of the element
                const rect = targetElement.getBoundingClientRect();
                const absoluteTop = rect.top + window.pageYOffset;
                const targetPosition = absoluteTop - 80; // 80px offset from top
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000; // 1.5 seconds for smooth animation
                let startTime: number | null = null;

                function animation(currentTime: number) {
                  if (startTime === null) startTime = currentTime;
                  const timeElapsed = currentTime - startTime;
                  const run = ease(timeElapsed, startPosition, distance, duration);
                  window.scrollTo(0, run);
                  if (timeElapsed < duration) requestAnimationFrame(animation);
                }

                // Enhanced easing function for smoother animation
                function ease(t: number, b: number, c: number, d: number) {
                  t /= d;
                  return -c * t * (t - 2) + b;
                }

                requestAnimationFrame(animation);
              }
            }}
            className="w-full sm:w-auto border-2 border-indigo-400 text-indigo-400 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-indigo-400 hover:text-white transition-colors">
              View Success Stories
            </button>
          </div>
        </div>        {/* Pain Points & Solution */}
        <section className="flex items-center justify-center py-8 sm:py-12 md:py-16">
          <div className="w-full max-w-5xl bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 mb-12 sm:mb-16 md:mb-20 mx-auto">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
              <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3 justify-center md:justify-start">
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" />
            The Challenge
          </h2>
          <ul className="space-y-3 sm:space-y-4">
            {["Traditional hiring may take months and costs $$$", "Resumes don't show real coding abilities", "Hard to find passionate, motivated developers"].map((text, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ 
            x: 8,
            transition: { type: 'spring', stiffness: 400, damping: 30 }
                }}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-lg bg-gray-700/40 text-gray-200 shadow-sm cursor-pointer hover:bg-red-500/10 hover:border-red-400/30 border border-transparent transition-all duration-300 group"
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full group-hover:bg-red-300 transition-colors"></div>
                <span className="text-sm sm:text-base font-medium group-hover:text-red-100 transition-colors">{text}</span>
              </motion.li>
            ))}
          </ul>
              </div>

              <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3 justify-center md:justify-start">
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
            Our Solution
          </h2>
          <ul className="space-y-3 sm:space-y-4">
            {["See developers build real projects in hackathons", "Access to pre-vetted, passionate talent", "Faster hiring with portfolio-backed candidates"].map((text, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                whileHover={{ 
            x: 8,
            transition: { type: 'spring', stiffness: 400, damping: 30 }
                }}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-lg bg-gray-700/40 text-gray-200 shadow-sm cursor-pointer hover:bg-green-500/10 hover:border-green-400/30 border border-transparent transition-all duration-300 group"
              >
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full group-hover:bg-green-300 transition-colors"></div>
                <span className="text-sm sm:text-base font-medium group-hover:text-green-100 transition-colors">{text}</span>
              </motion.li>
            ))}
          </ul>
              </div>
            </div>
          </div>
        </section>{/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Talent Pipeline
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">1000+ motivated developers</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <Code className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Project-Based
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Real projects, not just interviews
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Sponsorship
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Brand visibility + talent access
            </p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-2xl text-center hover:bg-gray-750 transition-colors">
            <HandshakeIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-indigo-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Custom Match
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm">
              Specific skills for your needs
            </p>
          </div>
        </div>        {/* Hackathon Showcase */}
        <div id='success-section' className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 mb-12 sm:mb-16 mt-8 sm:mt-12">
          <h2 id="events-gallery-title" className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
            Events Gallery
          </h2>
          <p className="text-sm sm:text-base text-gray-300 text-center mb-6 sm:mb-8 px-4">
            Highlights from our past hackathons, workshops, and community events
          </p>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 mb-12 sm:mb-16">
            {/* Row 1 */}
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-600 hover:scale-105 transition-transform cursor-pointer relative group">
              <img 
                src="/hackathon/hackathon1.jpg" 
                alt="Team collaboration during hackathon" 
                className="w-full h-full object-cover"
              />              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end justify-start p-2 sm:p-3">
                <span className="text-white text-xs sm:text-sm font-medium">Team Building</span>
              </div>
            </div>
            
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-600 hover:scale-105 transition-transform cursor-pointer relative group">
              <img 
                src="/hackathon/hackathon2.jpg" 
                alt="Developers coding together" 
                className="w-full h-full object-cover"
              />              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end justify-start p-2 sm:p-3">
                <span className="text-white text-xs sm:text-sm font-medium">Competition</span>
              </div>
            </div>
            
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-600 hover:scale-105 transition-transform cursor-pointer relative group">
              <img 
                src="/hackathon/hackathon3.jpg" 
                alt="Winners celebrating with trophy" 
                className="w-full h-full object-cover"
              />              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end justify-start p-2 sm:p-3">
                <span className="text-white text-xs sm:text-sm font-medium">Coding Session</span>
              </div>
            </div>
            
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-600 hover:scale-105 transition-transform cursor-pointer relative group">
              <img 
                src="/hackathon/hackathon4.jpg" 
                alt="Networking session between participants" 
                className="w-full h-full object-cover"
              />              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end justify-start p-2 sm:p-3">
                <span className="text-white text-xs sm:text-sm font-medium">Networking</span>
              </div>
            </div>

          </div>          {/* Event Stats */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 text-center mb-6 sm:mb-8">
            <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-indigo-400">5+</div>
              <div className="text-xs sm:text-sm text-gray-300">Events Hosted</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-purple-400">100+</div>
              <div className="text-xs sm:text-sm text-gray-300">Participants</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
              <div className="text-xl sm:text-2xl font-bold text-green-400">10+</div>
              <div className="text-xs sm:text-sm text-gray-300">Projects Built</div>
            </div>
          </div>
        </div>        {/* Contact Form */}
        <div id="contact-section" className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
            Partner With Us
          </h2>
          <p className="text-sm sm:text-base text-gray-300 text-center mb-6 sm:mb-8 px-4">
            Ready to discover exceptional talent? Let&apos;s discuss your hiring needs.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
            {submitStatus === "success" && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center">
          <strong>Thank you!</strong> We&apos;ll get back to you within 24 hours to discuss your partnership.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center">
          <strong>Oops!</strong> There was a problem sending your message. Please try again or contact us directly.
              </div>
            )}            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-300">Company Name *</label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your company name"
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-10 sm:h-12 text-sm sm:text-base"
            disabled={isSubmitting}
            required
          />
              </div>
              
              <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-300">Business Email *</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your.name@company.com"
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-10 sm:h-12 text-sm sm:text-base"
            disabled={isSubmitting}
            required
          />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-gray-300">Tell us about your hiring needs *</label>
              <Textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="What roles are you looking to fill? What skills are most important? How many developers do you need?"
          className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 h-24 sm:h-32 resize-none text-sm sm:text-base"
          disabled={isSubmitting}
          required
              />
            </div>            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 sm:px-8 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-sm sm:text-base">
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="hidden sm:inline">Sending Request...</span>
              <span className="sm:hidden">Sending...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Start Partnership Discussion</span>
              <span className="sm:hidden">Partner With Us</span>
            </div>
          )}
              </Button>
              
              <div className="flex items-center justify-center text-gray-400 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="hidden sm:inline">Response within 24h</span>
            <span className="sm:hidden">24h response</span>
          </div>              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
