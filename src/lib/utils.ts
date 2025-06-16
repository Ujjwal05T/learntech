import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const shouldShowNavbar = (pathname: string): boolean => {
  const noNavbarPaths = [
    '/organisation',
    '/login',
    '/register',
    '/test'
  ];
  
  return !noNavbarPaths.some(path => pathname.startsWith(path));
};
export const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const offset = 80; // Account for fixed header
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};