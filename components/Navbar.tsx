"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import me from "@/public/demo_image.png";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { IUser } from "@/types";
import { ThemeToggle } from "./ThemeToggle";
import { User, LogOut, PenSquare, BookOpen, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const { data: session } = useSession();

  const pathName = usePathname();
  const [showDropDown, setShowDropDown] = React.useState(false);
  const handleShowDropDown = () => setShowDropDown(!showDropDown);

  useEffect(() => {
    async function fetchUser() {
      if (!session?.user?._id) return;
      try {
        const res = await fetch(`/api/user/${session?.user?._id}`);
        if (res.ok) {
          const resData = await res.json();
          setUserData(resData);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, [session?.user?._id]);

  return (
    <nav className="fixed w-full top-0 z-50 glassmorphism border-b h-16 flex items-center">
      <div className="container flex justify-between items-center px-4 sm:px-8">
        <Link href={"/"} className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 0 }}
            initial={{ rotate: 3 }}
            className="bg-primary p-1.5 rounded-lg text-white"
          >
            <BookOpen className="w-5 h-5" />
          </motion.div>
          <h2 className="text-xl md:text-2xl font-black tracking-tighter">
            Write
            <span className="text-primary">Blog</span>
          </h2>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <li>
              <Link
                href={"/blog"}
                className={`${
                  pathName === "/blog"
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                } transition-colors relative group`}
              >
                Explore
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: pathName === "/blog" ? 1 : 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left transition-transform"
                />
              </Link>
            </li>

            {session?.user && (
              <li>
                <Link
                  href={"/create-blog"}
                  className={`${
                    pathName === "/create-blog"
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-colors flex items-center gap-1.5 relative group`}
                >
                  <PenSquare className="w-4 h-4" />
                  Write
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: pathName === "/create-blog" ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left transition-transform"
                  />
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {session?.user ? (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowDropDown}
                  className="flex items-center gap-2 p-1 pl-3 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="hidden sm:inline text-sm font-medium">
                    {userData?.name || "User"}
                  </span>
                  <div className="relative w-8 h-8">
                    <Image
                      src={userData?.avatar?.url || me}
                      alt="avatar"
                      fill
                      className="rounded-full object-cover border border-background"
                    />
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropDown ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {showDropDown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-12 right-0 w-52 py-2 glassmorphism rounded-2xl border border-border shadow-2xl origin-top-right overflow-hidden"
                    >
                      <Link
                        onClick={() => setShowDropDown(false)}
                        href={`/user/${session?.user?._id?.toString()}`}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile
                      </Link>
                      <div className="h-px bg-border my-1" />
                      <button
                        onClick={() => {
                          signOut();
                          setShowDropDown(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={"/login"}
                  className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-2"
                >
                  Log In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={"/signup"}
                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-shadow"
                  >
                    Join Now
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
