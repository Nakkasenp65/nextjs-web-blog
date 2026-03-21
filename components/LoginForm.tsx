"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { LogIn, Loader2, Sparkles } from "lucide-react";

const LoginForm = () => {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!state.email || !state.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        email: state.email,
        password: state.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
        return;
      }

      setSuccess("Login successful! Welcome back.");
      setTimeout(() => {
        router.push("/blog");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glassmorphism p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16" />
        
        <div className="text-center mb-8 relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to continue your story</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              name="email"
              onChange={handleChange}
              value={state.email}
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">Password</label>
              <Link href="#" className="text-[10px] font-bold text-primary hover:underline underline-offset-2">Forgot?</Link>
            </div>
            <Input
              placeholder="••••••••"
              type="password"
              name="password"
              onChange={handleChange}
              value={state.password}
            />
          </div>

          <div className="pt-2">
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold mb-4 text-center italic">
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-500 text-xs font-bold mb-4 text-center italic">
                {success}
              </motion.p>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full btn-primary h-12 rounded-2xl text-base font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-bold hover:underline underline-offset-4 flex items-center justify-center gap-1.5 mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              Join the community
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
