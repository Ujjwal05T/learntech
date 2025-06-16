'use client';

export default function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0b1018] to-[#1a1f2e] text-white">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium text-blue-300">Loading...</p>
      </div>
    </div>
  );
}