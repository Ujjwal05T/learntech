import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center sm:h-[80vh]">
          <h1 className="text-5xl md:text-6xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
            Learn Tech Roadmaps
          </h1>
          
          <p className="text-slate-300 text-center max-w-2xl text-lg mb-8">
            Discover structured learning paths for different tech roles. Our roadmaps help you navigate 
            your journey from beginner to professional in the tech industry.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link 
              href="/roadmaps" 
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
            >
              View Roadmaps
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-300 transition-colors text-center font-semibold"
            >
              Get Started
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Structured Learning</h3>
              <p className="text-slate-400">Clear, step-by-step guidance for your tech journey</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Multiple Paths</h3>
              <p className="text-slate-400">Choose from various tech career roadmaps</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Community Driven</h3>
              <p className="text-slate-400">Updated content based on industry trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}