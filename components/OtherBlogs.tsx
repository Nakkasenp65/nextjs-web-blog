"use client";

import React from "react";
import Image from "next/image";
import demoImage from "@/public/demo_image.jpg";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { IBlog, IUser } from "@/types";
import { motion } from "framer-motion";
import { BLUR_PLACEHOLDER } from "@/lib/constants";

interface OtherBlogsProps {
  otherBlogs: (IBlog & { authorId: IUser })[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const OtherBlogs: React.FC<OtherBlogsProps> = ({ otherBlogs }) => {
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <section className="container py-12">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        {otherBlogs?.map((item, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link href={`/blog/${item?._id.toString()}`} className="group block h-full">
              <div className="glassmorphism rounded-[2.5rem] p-6 h-full border border-border/50 group-hover:border-primary/50 transition-all shadow-xl flex flex-col">
                <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-6 shadow-lg">
                  <Image
                    src={item?.image?.url || demoImage}
                    alt={item?.title}
                    fill
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-background/80 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/20">
                      {item?.category}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDate(item?.createdAt)}
                  </div>

                  <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item?.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {item?.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-border/50">
                  <div className="relative w-10 h-10 rounded-full border-2 border-primary/50 overflow-hidden">
                    <Image
                      src={item?.authorId?.avatar?.url || demoImage}
                      alt={item?.authorId?.name}
                      fill
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h6 className="font-black text-xs truncate">{item?.authorId?.name}</h6>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight truncate">
                      {item?.authorId?.designation}
                    </p>
                  </div>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="text-primary"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default OtherBlogs;
