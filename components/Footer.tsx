"use client";

import Link from "next/link";
import React from "react";
import { BookOpen, Github, Twitter, Linkedin, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glassmorphism border-t mt-auto">
      <div className="container py-12 px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-6">
            <Link href={"/"} className="flex items-center gap-2 group w-fit">
              <div className="bg-primary p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter">
                Write
                <span className="text-primary">Blog</span>
              </h2>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed">
              Empowering voices globally. Our mission is to provide a clean, modern space for storytellers to share their narratives and connect with a like-minded community.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
                { icon: <Github className="w-5 h-5" />, href: "#" },
                { icon: <Linkedin className="w-5 h-5" />, href: "#" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="p-2 rounded-full bg-muted border border-border hover:border-primary/50 transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Platform</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">Explore Feed</Link>
              </li>
              <li>
                <Link href="/create-blog" className="hover:text-primary transition-colors">Create Blog</Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">Become a Member</Link>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Company</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">Our Story</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            © {currentYear} WriteBlog. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium group">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-primary fill-primary" />
            </motion.div>
            <span>by Storytellers around the globe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
