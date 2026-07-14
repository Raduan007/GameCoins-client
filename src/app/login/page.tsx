"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { TextField, Label, Input, Button, Card, CardContent } from "@heroui/react";
import { Eye, EyeOff, Mail, Lock, Gamepad2, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function LoginContent() {
  const { login, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const loginWithGoogleRef = useRef(loginWithGoogle);

  useEffect(() => {
    loginWithGoogleRef.current = loginWithGoogle;
  }, [loginWithGoogle]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log("[Google Auth] Component mounted on client. Checking Client ID...");
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("[Google Auth] Error: NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing or empty.");
    } else {
      console.log("[Google Auth] NEXT_PUBLIC_GOOGLE_CLIENT_ID loaded:", clientId);
    }

    const initializeGoogleSignIn = () => {
      const google = (window as any).google;
      
      // Verify window.google existence checks
      if (!google) {
        console.warn("[Google Auth] Warning: window.google is not defined yet.");
        return false;
      }
      if (!google.accounts || !google.accounts.id) {
        console.warn("[Google Auth] Warning: window.google.accounts.id is not defined yet.");
        return false;
      }

      console.log("[Google Auth] SDK is available. Initializing Google Accounts ID API...");
      try {
        google.accounts.id.initialize({
          client_id: clientId || "",
          callback: async (response: any) => {
            const idToken = response.credential;
            console.log("[Google Auth] Callback received ID token. Starting login flow...");
            setGoogleSubmitting(true);
            try {
              await loginWithGoogleRef.current(idToken);
              console.log("[Google Auth] Login successful.");
              toast.success("Welcome back! Login successful.");
            } catch (err: any) {
              console.error("[Google Auth] Authentication failed:", err);
              toast.error(err.message || "Failed to authenticate via Google");
            } finally {
              setGoogleSubmitting(false);
            }
          },
        });
        console.log("[Google Auth] Google Accounts ID API successfully initialized.");

        // Verify the Google button container exists in DOM
        const btnElement = document.getElementById("google-signin-button");
        if (btnElement) {
          console.log("[Google Auth] Button container found. Rendering Google Sign-In button...");
          google.accounts.id.renderButton(
            btnElement,
            {
              theme: "outline",
              size: "large",
              text: "continue_with",
              width: 320,
            }
          );
          console.log("[Google Auth] Google Sign-In button successfully rendered.");
          return true;
        } else {
          console.error("[Google Auth] Error: Button container '#google-signin-button' not found in DOM.");
          return false;
        }
      } catch (error) {
        console.error("[Google Auth] Error during initialization or button rendering:", error);
        return false;
      }
    };

    // Verify duplicate script loading is prevented
    const scriptSrc = "https://accounts.google.com/gsi/client?hl=en";
    let script = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement;

    const handleScriptLoad = () => {
      console.log("[Google Auth] Script loaded event fired.");
      initializeGoogleSignIn();
    };

    if (!script) {
      console.log("[Google Auth] Script tag not found. Appending to body...");
      script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      script.onload = handleScriptLoad;
      script.onerror = (e) => {
        console.error("[Google Auth] Error: Failed to load Google script:", e);
      };
      document.body.appendChild(script);
    } else {
      console.log("[Google Auth] Script tag already exists in document.");
      // Script already exists. If window.google is already defined, initialize.
      if ((window as any).google?.accounts?.id) {
        console.log("[Google Auth] window.google is already available.");
        initializeGoogleSignIn();
      } else {
        console.log("[Google Auth] Script tag exists but window.google is not ready yet. Attaching onload/polling fallback.");
        const existingOnload = script.onload;
        script.onload = (e) => {
          if (existingOnload) {
            (existingOnload as any).call(script, e);
          }
          handleScriptLoad();
        };

        // Fallback polling to ensure we initialize even if onload has already run
        let attempts = 0;
        const checkInterval = setInterval(() => {
          attempts++;
          if ((window as any).google?.accounts?.id) {
            clearInterval(checkInterval);
            console.log("[Google Auth] window.google became available via polling.");
            initializeGoogleSignIn();
          } else if (attempts > 20) {
            clearInterval(checkInterval);
            console.error("[Google Auth] Error: Timed out waiting for window.google to load.");
          }
        }, 250);
      }
    }
  }, [mounted]);

  const togglePassword = () => setShowPassword(!showPassword);

  // If already authenticated, redirect to target path immediately
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl]);

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
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                      <div className="flex h-10 w-10 items-center justify-center">
                        <img src="/assets/gamecoins.png" alt="GameCoins" className="h-10 w-10 object-contain" />
                      </div>
                      <span className="text-2xl font-bold text-text tracking-wide">
                        Game<span className="text-primary">Coins</span>
                      </span>
                    </Link>
          <h2 className="text-3xl font-extrabold text-text tracking-tight">
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

              {/* Submit Button */}
              <Button
                type="submit"
                isDisabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-6 font-bold bg-primary text-white hover:bg-primary-dark cursor-pointer shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 border-t border-border/20"></div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-dim">Or Continue With</span>
              <div className="flex-1 border-t border-border/20"></div>
            </div>

            <div className="flex flex-col items-center justify-center w-full min-h-[46px] gap-2">
              <div 
                id="google-signin-button" 
                className="w-full flex justify-center"
                style={{ minHeight: "44px", display: "flex", justifyContent: "center", zIndex: 10 }}
              ></div>
              {googleSubmitting && (
                <div className="text-[10px] text-text-dim animate-pulse font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" /> Connecting with Google...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footnote */}
        <p className="mt-6 text-center text-sm text-text-muted">
          New to GameCoins?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary-light transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
