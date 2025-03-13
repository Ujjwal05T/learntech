"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  return (
    <nav className="bg-[#060317] shadow-md sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between h-14 items-center">
          {/* Brand Name */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">LearnTech</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex space-x-8">
            <Link
              href="/home"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors">
              Home
            </Link>
            <Link
              href="/roadmaps"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors">
              Roadmaps
            </Link>
            <Link
              href="/news"
              className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors">
              News
            </Link>
            <Button>
            {/* {isLoggedIn ? (
                <Link href="/profile" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors">
                  Profile
                </Link>
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition-colors">
                  Login
                </Link>
              )} */}
              <Link 
              href="/profile"
              className="text-orange-600 hover:border-blue-600 px-3 py-2 rounded-full transition-colors font-bold">
              P
            </Link>
              </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <button
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsOpen(true)}>
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
          <div
            className={`
          fixed z-10 inset-0 bg-black bg-opacity-50 transition-opacity duration-300 sm:hidden
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
                `}
            onClick={() => setIsOpen(false)}>
            <div
              className={`
            fixed inset-y-0 right-0 w-48 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}
              onClick={(e) => e.stopPropagation()}>
              {/* Drawer Header */}
              <div className="p-3 border-b flex justify-between items-center">
                <span className="font-semibold text-lg">Menu</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="py-1">
                <Link
                  href="/home"
                  className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <Link
                  href="/roadmaps"
                  className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}>
                  Roadmaps
                </Link>
                <Link
                  href="/news"
                  className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}>
                  News
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
