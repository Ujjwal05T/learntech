"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { LucideMenu, LucideX, LucideUser, LucideHome, LucideMap, LucideNewspaper } from "lucide-react";
import { cn } from "@/lib/utils";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-[#060317]/90 backdrop-blur-sm border-b border-slate-800/50 h-12" 
          : "bg-[#060317] h-16"
      )}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
            aria-label="LearnTech Home"
          >
            <div className="relative h-8 w-8">
              {/* Replace with your logo or icon */}
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hidden sm:inline-block">
              LearnTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/home" isActive={pathname === "/home"}>
              <LucideHome className="w-4 h-4 mr-1.5" />
              Home
            </NavLink>
            
            <NavLink href="/roadmaps" isActive={pathname.includes("/roadmaps")}>
              <LucideMap className="w-4 h-4 mr-1.5" />
              Roadmaps
            </NavLink>
            
            <NavLink href="/news" isActive={pathname === "/news"}>
              <LucideNewspaper className="w-4 h-4 mr-1.5" />
              News
            </NavLink>
            
            <ProfileButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
            {isOpen ? (
              <LucideX className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <LucideMenu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Slide-in Panel) */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
        
        {/* Panel */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-64 bg-[#0c0825] shadow-xl transform transition-transform duration-300 ease-in-out p-5",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
            <h2 className="text-lg font-medium text-white">Menu</h2>
            <button
              className="rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <LucideX className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex flex-col space-y-1">
            <MobileNavLink 
              href="/home" 
              isActive={pathname === "/home"}
              onClick={() => setIsOpen(false)}
            >
              <LucideHome className="w-5 h-5 mr-3 text-blue-400" />
              Home
            </MobileNavLink>
            
            <MobileNavLink 
              href="/roadmaps" 
              isActive={pathname.includes("/roadmaps")}
              onClick={() => setIsOpen(false)}
            >
              <LucideMap className="w-5 h-5 mr-3 text-blue-400" />
              Roadmaps
            </MobileNavLink>
            
            <MobileNavLink 
              href="/news" 
              isActive={pathname === "/news"}
              onClick={() => setIsOpen(false)}
            >
              <LucideNewspaper className="w-5 h-5 mr-3 text-blue-400" />
              News
            </MobileNavLink>
            
            <MobileNavLink 
              href="/profile" 
              isActive={pathname === "/profile"}
              onClick={() => setIsOpen(false)}
            >
              <LucideUser className="w-5 h-5 mr-3 text-blue-400" />
              Profile
            </MobileNavLink>
          </nav>
          
          <div className="absolute bottom-8 left-5 right-5">
            <div className="mt-6 pt-6 border-t border-gray-700">
              <Button
                variant="outline"
                className="w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:text-blue-300"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/profile";
                }}
              >
                <LucideUser className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Desktop Navigation Link Component
const NavLink = ({ href, isActive, children }:{href:string,isActive:boolean,children:React.ReactNode}) => {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center",
        isActive
          ? "bg-blue-900/30 text-blue-100"
          : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
      )}
    >
      {children}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ href, isActive, onClick, children }:{href:string,isActive:boolean,children:React.ReactNode,onClick:()=>void}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors duration-200",
        isActive
          ? "bg-blue-900/30 text-white"
          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// Profile Button Component
const ProfileButton = () => {
  return (
    <Link href="/profile">
      <Button 
        className="ml-3 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center"
        aria-label="View Profile"
      >
        <LucideUser className="w-4 h-4 mr-2" />
        Profile
      </Button>
    </Link>
  );
};

export default Navbar;