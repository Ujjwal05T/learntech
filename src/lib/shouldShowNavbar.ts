export const shouldShowNavbar = (pathname: string): boolean => {
    const noNavbarPaths = [
      '/organisation',
      '/login',
      '/register',
      '/test',
      '/events'
    ];
    
    return !noNavbarPaths.some(path => pathname.startsWith(path));
  };