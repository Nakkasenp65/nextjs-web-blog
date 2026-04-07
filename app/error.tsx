"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphism p-12 rounded-[3rem] border border-border/50 max-w-xl shadow-2xl"
      >
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-8">
          <AlertTriangle size={40} />
        </div>
        
        <h1 className="text-4xl font-black tracking-tight mb-4 italic text-primary">Something went wrong</h1>
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed font-medium">
          An unexpected error occurred in the WriteBlog studio. Don't worry, your stories are safe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto btn-primary rounded-full px-8 flex items-center justify-center gap-2"
          >
            <RefreshCcw size={18} />
            Try again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto btn bg-muted hover:bg-muted/80 rounded-full px-8 flex items-center justify-center gap-2 font-bold"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
