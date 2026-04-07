"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import demoImage from "@/public/demo_image.png";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        setIsOpen(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Search fetch error:", error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories..."
          className="w-full h-14 pl-12 pr-12 rounded-2xl glassmorphism border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (results.length > 0 || !isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 left-0 w-full glassmorphism rounded-3xl border border-border shadow-2xl z-50 overflow-hidden max-h-[400px] flex flex-col"
          >
            <div className="p-4 border-b border-border/50 bg-muted/30">
               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Search Results</p>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                results.map((blog) => (
                  <Link
                    key={blog._id}
                    href={`/blog/${blog._id}`}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors group border-b border-border/30 last:border-none"
                  >
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-border/50">
                      <Image
                        src={blog.image?.url || demoImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{blog.title}</h4>
                      <p className="text-xs text-muted-foreground truncate italic">{blog.category}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-bold text-muted-foreground italic">No stories found for "{query}"</p>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-primary/5 text-center border-t border-border/30">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">End of results</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
