"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<div className="min-h-screen bg-[#0a0a20] relative overflow-hidden">
			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl"></div>
				<div className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-purple-600/20 blur-3xl"></div>
				<div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-pink-600/20 blur-3xl"></div>
			</div>

			<div className="container mx-auto px-6 py-16 relative z-10">
				{/* Hero Section */}
				<div className="flex flex-col items-center justify-center min-h-[85vh] pt-10 pb-20">
					{mounted && (
						<>
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8 }}
								className="mb-4 text-center"
							>
								<span className="px-4 py-1 text-sm rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 mb-6 inline-block">
									Your path to tech excellence
								</span>
							</motion.div>

							<motion.h1 
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.2 }}
								className="text-5xl md:text-7xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-6 tracking-tight"
							>
								Learn Tech Roadmaps
							</motion.h1>

							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.4 }}
								className="text-slate-300 text-center max-w-2xl text-lg md:text-xl mb-12 leading-relaxed"
							>
								Discover structured learning paths for different tech roles. Our roadmaps help you navigate your journey from beginner to professional in the tech industry.
							</motion.p>

							{/* CTA Buttons */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.6 }}
								className="flex flex-col sm:flex-row gap-4 mb-20"
							>
								<Link href="/roadmaps" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 text-center font-semibold text-lg transform hover:scale-105">
									View Roadmaps
								</Link>
								<Link href="/register" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all text-center font-semibold text-lg transform hover:scale-105">
									Get Started
								</Link>
							</motion.div>

							{/* Features */}
							<motion.div 
								variants={container}
								initial="hidden"
								animate="show"
								className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
							>
								<motion.div variants={item} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl transform hover:scale-105 transition-all group hover:shadow-blue-500/10">
									<div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/30 transition-all">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
										</svg>
									</div>
									<h3 className="text-xl font-semibold text-white mb-3">Structured Learning</h3>
									<p className="text-slate-300">Clear, step-by-step guidance designed to take you from beginner to professional with confidence.</p>
								</motion.div>
								
								<motion.div variants={item} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl transform hover:scale-105 transition-all group hover:shadow-purple-500/10">
									<div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-5 group-hover:bg-purple-500/30 transition-all">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
										</svg>
									</div>
									<h3 className="text-xl font-semibold text-white mb-3">Multiple Paths</h3>
									<p className="text-slate-300">Choose from a variety of tech career roadmaps tailored to different roles and specializations.</p>
								</motion.div>
								
								<motion.div variants={item} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl transform hover:scale-105 transition-all group hover:shadow-pink-500/10">
									<div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-5 group-hover:bg-pink-500/30 transition-all">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
										</svg>
									</div>
									<h3 className="text-xl font-semibold text-white mb-3">Community Driven</h3>
									<p className="text-slate-300">Content constantly updated based on industry trends and community feedback for relevance.</p>
								</motion.div>
							</motion.div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
