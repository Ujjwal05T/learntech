"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToken } from "@/hooks/useToken";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
  const router = useRouter();
  const { decodeAndSetUser } = useToken();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get token from URL parameters
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    
    if (token) {
      try {
        // Use the existing hook to decode and store the token
        const decodedUser = decodeAndSetUser(token);
        
        if (decodedUser) {
          // Redirect to home or dashboard
          router.push("/");
        } else {
          setError("Invalid token received.");
        }
      } catch (err) {
        setError("Error processing authentication.");
        console.error("OAuth callback error:", err);
      }
    } else {
      // Check for error parameter
      const errorMsg = searchParams.get('error');
      if (errorMsg) {
        setError(`Authentication failed: ${errorMsg}`);
      } else {
        setError("No authentication token received.");
      }
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [router, decodeAndSetUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded max-w-md text-center">
          <h2 className="font-bold mb-2">Authentication Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Completing authentication...</h2>
          <p className="text-muted-foreground">Please wait while we log you in</p>
        </div>
      )}
    </div>
  );
}