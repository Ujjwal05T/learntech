"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { LucideMenu, LucideX, LucideUser, LucideHome, LucideMap, LucideNewspaper, LucideCalendar, LucideLogIn, LucideUserPlus, LucideLogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToken } from "@/hooks/useToken";
import { useUserStore } from "../../stores/user-store";

interface User {
   userId:string,
   username: string,
   email: string,
   role:string
}

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const { isAuthenticated, removeToken } = useToken();
    const { user, clearUser } = useUserStore();

    // Ensure component is mounted before checking authentication
    useEffect(() => {
        setMounted(true);
    }, []);

    // Only check authentication after component is mounted
    const isUserAuthenticated = mounted ? isAuthenticated() : false;

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

    // Prevent body scroll when mobile menu is open or modal is open
    useEffect(() => {
        if (isOpen || showLogoutModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, showLogoutModal]);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
        setIsOpen(false); // Close mobile menu if open
    };

    const handleLogoutConfirm = () => {
        removeToken();
        clearUser();
        setShowLogoutModal(false);
        window.location.href = "/";
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    // Don't render authentication-dependent content until mounted
    if (!mounted) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#060317] h-16" aria-label="Main navigation">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                                <span className="text-white font-bold text-lg">L</span>
                            </div>
                            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hidden sm:inline-block">LearnTech</span>
                        </Link>
                        
                        {/* Loading placeholder */}
                        <div className="hidden md:flex items-center space-x-1">
                            <div className="animate-pulse bg-gray-700 h-8 w-20 rounded"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav
                className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-300", isScrolled ? "bg-[#060317]/90 backdrop-blur-sm border-b border-slate-800/50 h-12" : "bg-[#060317] h-16")}
                aria-label="Main navigation"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md" aria-label="LearnTech Home">
                            <div className="relative h-8 w-8">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">L</span>
                                </div>
                            </div>
                            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 hidden sm:inline-block">LearnTech</span>
                        </Link>

                        {/* Desktop Navigation - Always show all options */}
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
                            
                            <NavLink href="/events" isActive={pathname === "/events" || pathname.includes("/events/")}>
                                <LucideCalendar className="w-4 h-4 mr-1.5" />
                                Events
                            </NavLink>

                            <NavLink href="/test" isActive={pathname === "/test"}>
                                <LucideNewspaper className="w-4 h-4 mr-1.5" />
                                Test
                            </NavLink>

                            {/* Authentication Buttons - Only this changes based on auth */}
                            {isUserAuthenticated ? (
                                <AuthenticatedSection user={user} onLogout={handleLogoutClick} />
                            ) : (
                                <UnauthenticatedSection />
                            )}
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
                            {isOpen ? <LucideX className="block h-6 w-6" aria-hidden="true" /> : <LucideMenu className="block h-6 w-6" aria-hidden="true" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div 
                className={cn(
                    "md:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/80 transition-opacity duration-300"
                    style={{ opacity: isOpen ? 1 : 0 }}
                    onClick={() => setIsOpen(false)} 
                    aria-hidden="true" 
                />

                {/* Panel */}
                <div 
                    className={cn(
                        "absolute inset-y-0 right-0 w-64 bg-[#0c0825] shadow-xl p-5 transition-transform duration-300 ease-in-out",
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

                    {/* User Info Section - Only show if authenticated */}
                    {isUserAuthenticated && (
                        <div className="mb-4 p-3 bg-blue-600/10 rounded-lg border border-blue-500/20">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.username?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">
                                        {user?.username || 'User'}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Links - Always show all options */}
                    <nav className="flex flex-col space-y-1">
                        <MobileNavLink href="/home" isActive={pathname === "/home"} onClick={() => setIsOpen(false)}>
                            <LucideHome className="w-5 h-5 mr-3 text-blue-400" />
                            Home
                        </MobileNavLink>

                        <MobileNavLink href="/roadmaps" isActive={pathname.includes("/roadmaps")} onClick={() => setIsOpen(false)}>
                            <LucideMap className="w-5 h-5 mr-3 text-blue-400" />
                            Roadmaps
                        </MobileNavLink>

                        <MobileNavLink href="/news" isActive={pathname === "/news"} onClick={() => setIsOpen(false)}>
                            <LucideNewspaper className="w-5 h-5 mr-3 text-blue-400" />
                            News
                        </MobileNavLink>
                        
                        <MobileNavLink 
                            href="/events" 
                            isActive={pathname === "/events" || pathname.includes("/events/")} 
                            onClick={() => setIsOpen(false)}
                        >
                            <LucideCalendar className="w-5 h-5 mr-3 text-blue-400" />
                            Events
                        </MobileNavLink>

                        <MobileNavLink href="/test" isActive={pathname === "/test"} onClick={() => setIsOpen(false)}>
                            <LucideNewspaper className="w-5 h-5 mr-3 text-blue-400" />
                            Test
                        </MobileNavLink>

                        {/* Profile Link - Only show if authenticated */}
                        {isUserAuthenticated && (
                            <MobileNavLink href="/profile" isActive={pathname === "/profile"} onClick={() => setIsOpen(false)}>
                                <LucideUser className="w-5 h-5 mr-3 text-blue-400" />
                                Profile
                            </MobileNavLink>
                        )}
                    </nav>

                    {/* Bottom Section - Changes based on authentication */}
                    <div className="absolute bottom-8 left-5 right-5">
                        <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
                            {isUserAuthenticated ? (
                                <Button
                                    variant="outline"
                                    className="w-full bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600/20 hover:text-red-300"
                                    onClick={handleLogoutClick}
                                >
                                    <LucideLogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            ) : (
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:text-blue-300"
                                        onClick={() => {
                                            setIsOpen(false);
                                            window.location.href = "/login";
                                        }}
                                    >
                                        <LucideLogIn className="w-4 h-4 mr-2" />
                                        Login
                                    </Button>
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                        onClick={() => {
                                            setIsOpen(false);
                                            window.location.href = "/register";
                                        }}
                                    >
                                        <LucideUserPlus className="w-4 h-4 mr-2" />
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                        onClick={handleLogoutCancel}
                        aria-hidden="true"
                    />
                    
                    {/* Modal */}
                    <div className="relative bg-[#0c0825] border border-gray-700/50 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                                <LucideLogOut className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
                                <p className="text-sm text-gray-400">Are you sure you want to sign out?</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="mb-6">
                            <p className="text-gray-300 text-sm">
                                You will be redirected to the home page and will need to sign in again to access your account.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 bg-gray-800/30 text-gray-300 border border-gray-600/30 hover:bg-gray-700/30 hover:text-white"
                                onClick={handleLogoutCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                onClick={handleLogoutConfirm}
                            >
                                <LucideLogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Desktop Navigation Link Component
const NavLink = ({ href, isActive, children }: { href: string; isActive: boolean; children: React.ReactNode }) => {
    return (
        <Link
            href={href}
            className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center",
                isActive ? "bg-blue-900/30 text-blue-100" : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
            )}
        >
            {children}
        </Link>
    );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ href, isActive, onClick, children }: { href: string; isActive: boolean; children: React.ReactNode; onClick: () => void }) => {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors duration-200",
                isActive ? "bg-blue-900/30 text-white" : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
            )}
            onClick={onClick}
        >
            {children}
        </Link>
    );
};

// Authenticated Section Component
const AuthenticatedSection = ({ user, onLogout }: { user: User | null; onLogout: () => void }) => {
    return (
        <div className="flex items-center space-x-3 ml-3">
            {/* User Avatar & Profile Link */}
            <Link href="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800/40 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                </div>
                <span className="text-gray-300 text-sm font-medium hidden lg:block">
                    {user?.username || 'Profile'}
                </span>
            </Link>

            {/* Logout Button */}
            <Button
                variant="outline"
                size="sm"
                className="bg-red-600/10 text-red-400 border border-red-500/30 hover:bg-red-600/20 hover:text-red-300"
                onClick={onLogout}
            >
                <LucideLogOut className="w-4 h-4 mr-1" />
                Logout
            </Button>
        </div>
    );
};

// Unauthenticated Section Component
const UnauthenticatedSection = () => {
    return (
        <div className="flex items-center space-x-3 ml-3">
            <Link href="/login">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20 hover:text-blue-300"
                >
                    <LucideLogIn className="w-4 h-4 mr-1" />
                    Login
                </Button>
            </Link>
            <Link href="/register">
                <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/20"
                >
                    <LucideUserPlus className="w-4 h-4 mr-1" />
                    Sign Up
                </Button>
            </Link>
        </div>
    );
};

export default Navbar;