"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (error) setError(null);
    // if (success) setSuccess(null);
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Using axios for the request
      const response = await axios.post(
        "http://localhost:5000/auth/register",
        formData
      );
      // Handle success
      setSuccess(
        "Your account has been created successfully! Please Verify your account"
      );
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      // Handle errors
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button className="w-full">Create account</Button>
            {error && <div className="text-red-500">{error}</div>}
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-500 rounded">
                {success}
              </div>
            )}
            <div className="mt-2 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login here
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
