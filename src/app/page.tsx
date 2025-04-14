"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

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
      title: "Web Development Bootcamp",
      date: "April 20, 2024",
      type: "Workshop",
      slots: "50 slots remaining",
    },
    {
      title: "Tech Interview Preparation",
      date: "April 25, 2024",
      type: "Masterclass",
      slots: "Limited seats",
    },
    {
      title: "Spring Hackathon 2024",
      date: "May 1-3, 2024",
      type: "Competition",
      slots: "Team registrations open",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form submission logic here
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
              className="text-center space-y-8 py-12"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Your Career Starts Here
              </h1>
              <p className="text-lg text-gray-300">
                Explore personalized roadmaps, connect with experts, and discover
                career-starting opportunities.
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
                    className="px-8 py-6 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white/20"
                  >
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
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {features.map(({ title, description, stats }) => (
                <motion.div
                  key={title}
                  variants={item}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 shadow-xl transform hover:scale-105 transition-all"
                >
                  <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
                  <p className="text-slate-300 mb-6 text-lg">{description}</p>
                  <span className="text-sm font-medium px-4 py-2 rounded-full bg-white/5 text-blue-400">
                    {stats}
                  </span>
                </motion.div>
              ))}
            </motion.section>

            {/* Testimonials with more space */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-md p-16 rounded-2xl border border-white/10"
            >
              <p className="italic max-w-3xl mx-auto text-center text-gray-300 text-xl leading-relaxed">
                This platform gave me direction when I was lost in my tech journey. The
                roadmap and expert guidance helped me land my first internship and made me CTO!
                <footer className="mt-6 text-sm text-gray-400 not-italic">
                  - Ujjwal Tamrakar, CTO at LearnTech Co.
                </footer>
              </p>
            </motion.section>

            {/* Upcoming Events with more details */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text text-center">
                Upcoming Events & Opportunities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.title}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl"
                  >
                    <span className="text-sm text-blue-400 mb-4 block">{event.type}</span>
                    <h3 className="text-xl font-semibold text-white mb-4">{event.title}</h3>
                    <div className="space-y-2 text-gray-400">
                      <p>{event.date}</p>
                      <p className="text-sm">{event.slots}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Community Call to Action with more emphasis */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-6">
                Join Our Growing Community
              </h2>
			  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <motion.div
      variants={item}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"
    >
      <h3 className="text-3xl font-bold text-white mb-2">2000+</h3>
      <p className="text-gray-400">Active Students</p>
    </motion.div>
    <motion.div
      variants={item}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"
    >
      <h3 className="text-3xl font-bold text-white mb-2">10+</h3>
      <p className="text-gray-400">Partner Colleges</p>
    </motion.div>
    <motion.div
      variants={item}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"
    >
      <h3 className="text-3xl font-bold text-white mb-2">100+</h3>
      <p className="text-gray-400">Hackathons Organized</p>
    </motion.div>
    <motion.div
      variants={item}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl"
    >
      <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
      <p className="text-gray-400">Students Placed</p>
    </motion.div>
  </div>
            </motion.section>
          </div>
        )}

<footer className="bg-[#070714]/80 backdrop-blur-md border-t border-white/10">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">LearnTech</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              19/B, Arun Villa<br />
              Rajendra Nagar<br />
              Indore, 402012<br />
              Madhya Pradesh<br/>
			  India
            </p>
            <p className="text-gray-400 text-sm">
              Email: contact@learntech.com<br />
              Phone: +91 123-456-7890<br />
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/roadmaps" className="hover:text-blue-400 transition-colors">Roadmaps</Link></li>
              <li><Link href="/#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-xl font-semibold text-white">Get in Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Name"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
              <Textarea
                placeholder="Message"
                className="bg-white/5 border-white/10 text-white h-24"
                required
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-6">
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
            </div>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LearnTech. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
 
      </div>
    </div>	
  );
}