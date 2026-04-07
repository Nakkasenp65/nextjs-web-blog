"use client";

import React from "react";
import Image from "next/image";
import demoImage from "@/public/demo_image.jpg";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { IBlog, IUser } from "@/types";
import { motion } from "framer-motion";
import { BLUR_PLACEHOLDER } from "@/lib/constants";

interface FirstBlogProps {
  firstBlog: IBlog & { authorId: IUser };
}

const FirstBlog: React.FC<FirstBlogProps> = ({ firstBlog }) => {
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container py-12"
    >
      <Link href={`/blog/${firstBlog?._id.toString()}`} className="group block">
        <div className="glassmorphism rounded-[3rem] p-8 lg:p-12 overflow-hidden relative border border-border/50 group-hover:border-primary/50 transition-all shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 aspect-[16/10] relative rounded-[2rem] overflow-hidden shadow-2xl">
              <Image
                src={firstBlog?.image?.url || demoImage}
                alt={firstBlog?.title}
                fill
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <span className="text-white font-bold flex items-center gap-2">
                  Read Article <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6">
              <div className="flex items-center gap-4">
                <span className="bg-primary/10 text-primary text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  {firstBlog?.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                  <Calendar className="w-4 h-4 text-primary" />
                  {formatDate(firstBlog?.createdAt)}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] group-hover:text-primary transition-colors">
                  {firstBlog?.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                  {firstBlog?.excerpt}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="relative w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
                  <Image
                    src={firstBlog?.authorId?.avatar?.url || demoImage}
                    alt={firstBlog?.authorId?.name}
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h6 className="font-black text-sm">{firstBlog?.authorId?.name}</h6>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">
                    {firstBlog?.authorId?.designation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.section>
  );
};

export default FirstBlog;
