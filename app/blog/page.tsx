import React from "react";
import FirstBlog from "@/components/FirstBlog";
import OtherBlogs from "@/components/OtherBlogs";
import Blog from "@/models/Blog";
import { connect } from "@/lib/db";
import { IBlog } from "@/types";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

async function fetchBlogs(): Promise<IBlog[]> {
  await connect();
  const blogs = await Blog.find().populate("authorId").sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
}

const BlogPage = async () => {
  const blogs = await fetchBlogs();
  const firstBlog = blogs && blogs.length > 0 ? blogs[0] : null;
  const otherBlogs = blogs && blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="py-12">
      {blogs?.length > 0 ? (
        <>
          <div className="container px-4 sm:px-8 mb-4 flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Sparkles className="w-5 h-5" />
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tight">What's New</h1>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic">The latest stories from our community</p>
             </div>
          </div>
          
          {firstBlog && <FirstBlog firstBlog={firstBlog as any} />}
          
          <div className="container px-4 sm:px-8 my-16">
            <div className="h-px bg-border/50 w-full" />
          </div>

          <div className="container px-4 sm:px-8 mb-8 flex items-center gap-3">
             <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <BookOpenIcon />
             </div>
             <div>
                <h2 className="text-3xl font-black tracking-tight">Explore More</h2>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic">Dive deeper into various topics</p>
             </div>
          </div>
          
          {otherBlogs.length > 0 ? (
            <OtherBlogs otherBlogs={otherBlogs as any} />
          ) : (
            <div className="container px-4 sm:px-8 py-20 text-center glassmorphism rounded-[2rem] mx-auto max-w-4xl">
               <p className="text-muted-foreground italic font-bold">More stories are being crafted. Check back soon!</p>
            </div>
          )}
        </>
      ) : (
        <div className="container py-32 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
            <Sparkles className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4 text-muted-foreground">The blog is currently empty</h1>
          <p className="text-lg text-muted-foreground/60 italic">Be the first to share your voice with the world.</p>
        </div>
      )}
    </div>
  );
};

function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  );
}

export default BlogPage;
