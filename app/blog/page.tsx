import React from "react";
import FirstBlog from "@/components/FirstBlog";
import OtherBlogs from "@/components/OtherBlogs";
import Blog from "@/models/Blog";
import { connect } from "@/lib/db";
import { IBlog } from "@/types";
import { Sparkles, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

const BLOGS_PER_PAGE = 6;

async function fetchBlogs(page: number = 1): Promise<{ blogs: IBlog[], total: number }> {
  await connect();
  const skip = (page - 1) * BLOGS_PER_PAGE;
  
  const [blogs, total] = await Promise.all([
    Blog.find()
      .populate("authorId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(BLOGS_PER_PAGE)
      .lean(),
    Blog.countDocuments()
  ]);

  return {
    blogs: JSON.parse(JSON.stringify(blogs)),
    total
  };
}

const BlogPage = async (props: { searchParams: Promise<{ page?: string }> }) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const { blogs, total } = await fetchBlogs(currentPage);
  
  const totalPages = Math.ceil(total / BLOGS_PER_PAGE);
  const firstBlog = blogs && blogs.length > 0 ? blogs[0] : null;
  const otherBlogs = blogs && blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <div className="py-12">
      {blogs?.length > 0 ? (
        <>
          <div className="container px-4 sm:px-8 mb-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                   <Sparkles className="w-5 h-5" />
                </div>
                <div>
                   <h1 className="text-4xl font-black tracking-tight">What's New</h1>
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic">The latest stories from our community</p>
                </div>
             </div>
             {totalPages > 1 && (
               <div className="hidden sm:flex items-center gap-2 text-sm font-bold bg-muted/30 px-4 py-2 rounded-full border border-border/50">
                 <span className="text-primary">{currentPage}</span>
                 <span className="text-muted-foreground">/</span>
                 <span>{totalPages}</span>
               </div>
             )}
          </div>
          
          {firstBlog && <FirstBlog firstBlog={firstBlog as any} />}
          
          <div className="container px-4 sm:px-8 my-16">
            <div className="h-px bg-border/50 w-full" />
          </div>

          <div className="container px-4 sm:px-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                   <BookOpenIcon />
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tight">Explore More</h2>
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest italic">Dive deeper into various topics</p>
                </div>
             </div>
             <SearchBar />
          </div>
          
          {otherBlogs.length > 0 ? (
            <OtherBlogs otherBlogs={otherBlogs as any} />
          ) : (
            currentPage === 1 && (
              <div className="container px-4 sm:px-8 py-20 text-center glassmorphism rounded-[2rem] mx-auto max-w-4xl">
                 <p className="text-muted-foreground italic font-bold">More stories are being crafted. Check back soon!</p>
              </div>
            )
          )}

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="container px-4 sm:px-8 mt-20 flex items-center justify-center gap-4">
              <Link
                href={`/blog?page=${Math.max(1, currentPage - 1)}`}
                aria-label="Previous page"
                className={`flex items-center gap-2 h-14 px-8 rounded-2xl glassmorphism border border-border/50 font-black transition-all active:scale-95 ${
                  currentPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-muted"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                PREV
              </Link>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blog?page=${p}`}
                    aria-label={`Go to page ${p}`}
                    aria-current={currentPage === p ? "page" : undefined}
                    className={`hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl border font-black transition-all active:scale-95 ${
                      currentPage === p
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110"
                        : "glassmorphism border-border/50 hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              <Link
                href={`/blog?page=${Math.min(totalPages, currentPage + 1)}`}
                aria-label="Next page"
                className={`flex items-center gap-2 h-14 px-8 rounded-2xl glassmorphism border border-border/50 font-black transition-all active:scale-95 ${
                  currentPage === totalPages ? "opacity-30 pointer-events-none" : "hover:bg-muted"
                }`}
              >
                NEXT
                <ChevronRight className="w-5 h-5" />
              </Link>
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
