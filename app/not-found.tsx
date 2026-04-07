"use client";

import { Ghost, Home, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="container min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism p-12 rounded-[3rem] border border-border/50 max-w-xl shadow-2xl"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-10">
          <Ghost size={48} className="animate-bounce" />
        </div>
        
        <h1 className="text-5xl font-black tracking-tight mb-4 italic text-primary">404</h1>
        <h2 className="text-2xl font-bold mb-6 italic">Story Not Found</h2>
        
        <p className="text-muted-foreground mb-10 text-lg leading-relaxed font-medium">
          The narrative you're looking for has drifted into the void. It might have been deleted or moved to another universe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto btn-primary rounded-full px-10 flex items-center justify-center gap-2 h-14 text-base font-black shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Home size={18} />
            Go Home
          </Link>
          
          <Link
            href="/blog"
            className="w-full sm:w-auto btn glassmorphism border-border hover:bg-muted rounded-full px-10 flex items-center justify-center gap-2 h-14 text-base font-black transition-all active:scale-95"
          >
            <Search size={18} />
            Explore Stories
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
