"use client";
import { useState, useEffect, use } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import ErrorPage from "@/components/ErrorPage";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface VerifyPageProps {
  searchParams: Promise<{ email: string }>;
}

export default function VerifyPage({searchParams}:VerifyPageProps) {
  const router = useRouter();
  const { email } = use(searchParams);

  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:5000/auth/verify", {
        email,
        otp,
      });

      router.push("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Verification failed. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!email || !validateEmail(email)) {
    return <ErrorPage />;
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Account</CardTitle>
          <CardDescription>
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter verification code"
                className="text-center text-lg letter-spacing-1"
                maxLength={6}
              />
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || otp.length < 6}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>

            <div className="text-center text-sm">
              {timeRemaining > 0 ? (
                <p>
                  Code expires in {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, "0")}
                </p>
              ) : (
                <Button type="button" variant="outline" disabled={isLoading}>
                  Register Again
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
