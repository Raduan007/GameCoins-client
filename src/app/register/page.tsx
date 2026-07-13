"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { TextField, Label, Input, Button, Card, CardContent } from "@heroui/react";
import { Eye, EyeOff, Mail, Lock, User, Gamepad2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(name, email, password);
      toast.success("Account registered successfully! Please log in.");
      router.push("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      const backendMessage = err.message || "Registration failed. Please try again.";
      
      // Attempt to map error to input fields if appropriate
      if (backendMessage.toLowerCase().includes("email")) {
        setValidationErrors({ email: backendMessage });
      } else {
        toast.error(backendMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = authLoading || submitting;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg z-10">
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
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Start topping up your games instantly with exclusive rates
          </p>
        </div>

        {/* Card wrapper with glassmorphism */}
        <Card className="border border-border/40 bg-surface/60 backdrop-blur-xl shadow-2xl rounded-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <TextField className="flex flex-col gap-1.5 w-full">
                <Label className="text-white text-sm font-medium">Full Name</Label>
                <div className={`flex items-center bg-surface-light/40 border rounded-xl px-3 py-2.5 focus-within:border-primary transition-all ${validationErrors.name ? 'border-danger' : 'border-border'}`}>
                  <User className="h-4 w-4 text-text-dim mr-2.5" />
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationErrors.name) {
                        setValidationErrors((prev) => ({ ...prev, name: "" }));
                      }
                    }}
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-danger text-xs mt-0.5">{validationErrors.name}</p>
                )}
              </TextField>

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

              {/* Confirm Password Field */}
              <TextField className="flex flex-col gap-1.5 w-full">
                <Label className="text-white text-sm font-medium">Confirm Password</Label>
                <div className={`flex items-center bg-surface-light/40 border rounded-xl px-3 py-2.5 focus-within:border-primary transition-all ${validationErrors.confirmPassword ? 'border-danger' : 'border-border'}`}>
                  <Lock className="h-4 w-4 text-text-dim mr-2.5" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (validationErrors.confirmPassword) {
                        setValidationErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }
                    }}
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-text-dim focus:ring-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="focus:outline-none text-text-dim hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-danger text-xs mt-0.5">{validationErrors.confirmPassword}</p>
                )}
              </TextField>

              {/* Register Button */}
              <Button
                type="submit"
                variant="primary"
                isPending={isLoading}
                className="w-full h-11 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            {/* Switch to Login Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-text-muted">Already have an account? </span>
              <Link href="/login" className="text-primary hover:text-primary-light font-semibold underline transition-colors">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
