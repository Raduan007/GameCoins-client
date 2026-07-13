"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { TextField, Label, Input, Button, Card, CardContent } from "@heroui/react";
import { Eye, EyeOff, Mail, Lock, Gamepad2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  // If already authenticated, redirect to dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back! Login successful.");
    } catch (err: any) {
      console.error("Login error:", err);
      const backendMessage = err.message || "Invalid email or password";
      toast.error(backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = authLoading || submitting;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
              <Gamepad2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">
              Game<span className="text-primary">Coins</span>
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Log in to manage your game credits top-ups
          </p>
        </div>

        {/* Card wrapper with glassmorphism */}
        <Card className="border border-border/40 bg-surface/60 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <TextField className="flex flex-col gap-1.5 w-full">
                <Label className="text-white text-sm font-medium">Email Address</Label>
                <div className={`flex items-center bg-surface-light/40 border rounded-xl px-3 py-2.5 focus-within:border-primary transition-all ${validationErrors.email ? 'border-danger' : 'border-border'}`}>
                  <Mail className="h-4 w-4 text-text-dim mr-2.5" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-danger text-xs mt-0.5">{validationErrors.email}</p>
                )}
              </TextField>

              {/* Password Field */}
              <TextField className="flex flex-col gap-1.5 w-full">
                <Label className="text-white text-sm font-medium">Password</Label>
                <div className={`flex items-center bg-surface-light/40 border rounded-xl px-3 py-2.5 focus-within:border-primary transition-all ${validationErrors.password ? 'border-danger' : 'border-border'}`}>
                  <Lock className="h-4 w-4 text-text-dim mr-2.5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="focus:outline-none text-text-dim hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-danger text-xs mt-0.5">{validationErrors.password}</p>
                )}
              </TextField>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                isPending={isLoading}
                className="w-full h-11 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            {/* Switch to Register Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-text-muted">New to GameCoins? </span>
              <Link href="/register" className="text-primary hover:text-primary-light font-semibold underline transition-colors">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
