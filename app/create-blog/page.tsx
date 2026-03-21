"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  X, 
  Send, 
  Loader2, 
  Type, 
  Quote, 
  AlignLeft, 
  Hash,
  Sparkles,
  Info
} from "lucide-react";

import { createBlog } from "@/actions/blogActions";
import demoImage from "@/public/demo_image.jpg";

const CreateBlog = () => {
  const [state, setState] = useState({
    title: "",
    description: "",
    excerpt: "",
    quote: "",
    category: "Tech",
    photo: "" as File | "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, status }: any = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [state.description]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
  
  if (status === "unauthenticated") return (
    <div className="container py-32 text-center">
      <h2 className="text-2xl font-black mb-4">Authentication Required</h2>
      <p className="text-muted-foreground mb-8">Please login to access the storyteller's studio.</p>
      <button onClick={() => router.push("/login")} className="btn-primary rounded-full px-8">Log In</button>
    </div>
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setError("");
    const { name, value, type } = event.target as any;
    if (type === "file") {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setState({ ...state, [name]: file });
        setPhotoPreview(URL.createObjectURL(file));
      }
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { photo, title, category, description, excerpt, quote } = state;

    if (!title || !description || !category || !excerpt || !quote) {
      setError("Please complete all sections before publishing.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      let image = null;
      if (photo && photo instanceof File) {
        const formdata = new FormData();
        formdata.append("file", photo);
        const { uploadPhoto } = await import("@/actions/uploadActions");
        image = await uploadPhoto(formdata);
      }

      const newBlog = {
        title,
        description,
        excerpt,
        quote,
        category,
        image,
        authorId: session?.user?._id,
      };

      await createBlog(newBlog);
      setSuccess("Your story has been published!");
      setTimeout(() => router.push("/blog"), 1500);
    } catch (error) {
      setError("An error occurred during publication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Writing Canvas (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 w-full space-y-8"
          >
            {/* Writing Area Wrapper with Glassmorphism */}
            <div className="glassmorphism rounded-[3rem] p-8 md:p-12 shadow-2xl border border-border/50 relative overflow-hidden min-h-[800px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-32 -mt-32" />
              
              {/* Cover Image Section */}
              <div className="relative group aspect-[21/9] w-full rounded-[2rem] overflow-hidden bg-muted/50 border border-border/50 mb-12 shadow-xl">
                {photoPreview ? (
                  <>
                    <Image src={photoPreview} alt="Cover" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button 
                      onClick={() => { setPhotoPreview(null); setState({...state, photo: ""}) }}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-red-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors group">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform shadow-inner">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-black text-muted-foreground group-hover:text-primary uppercase tracking-widest">Add Cover Image</span>
                    <input type="file" accept="image/*" onChange={handleChange} name="photo" className="hidden" />
                  </label>
                )}
              </div>

              {/* Title Input */}
              <textarea
                name="title"
                placeholder="Story Title..."
                rows={1}
                value={state.title}
                onChange={handleChange}
                className="w-full bg-transparent text-4xl md:text-6xl font-black tracking-tight border-none focus:ring-0 placeholder:text-muted-foreground/20 resize-none overflow-hidden leading-[1.1] mb-8"
              />

              {/* Divider */}
              <div className="h-px bg-border/50 w-32 mb-12" />

              {/* Description Input */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  name="description"
                  placeholder="Tell your story..."
                  value={state.description}
                  onChange={handleChange}
                  className="w-full bg-transparent text-lg md:text-xl leading-relaxed border-none focus:ring-0 placeholder:text-muted-foreground/20 resize-none overflow-hidden min-h-[400px]"
                />
              </div>
            </div>
          </motion.div>

          {/* Persistent Sidebar (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[380px] space-y-6 lg:sticky lg:top-24"
          >
            {/* Quick Tips (Now at Top) */}
            <div className="p-6 rounded-3xl border border-dashed border-border/50 flex gap-4 bg-muted/20">
               <Info className="w-5 h-5 text-primary shrink-0" />
               <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tighter">
                 Storytelling tip: Focus on the metadata first to give your story a clear direction and audience.
               </p>
            </div>

            {/* Settings Card */}
            <div className="glassmorphism rounded-[2rem] p-8 border border-border/50 shadow-xl space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" /> Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["Tech", "Entertainment", "Sports", "Health", "Animals"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setState({...state, category: cat})}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        state.category === cat 
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' 
                          : 'bg-muted/50 border-border hover:border-primary/50 text-muted-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Type className="w-3.5 h-3.5" /> Excerpt
                </label>
                <textarea
                  name="excerpt"
                  rows={3}
                  placeholder="Brief summary..."
                  value={state.excerpt}
                  onChange={handleChange}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-medium"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Quote className="w-3.5 h-3.5" /> Highlight Quote
                </label>
                <textarea
                  name="quote"
                  rows={2}
                  placeholder="A powerful line..."
                  value={state.quote}
                  onChange={handleChange}
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none italic font-medium"
                />
              </div>
            </div>

            {/* Publish Card (Now at Bottom) */}
            <div className="glassmorphism rounded-[2rem] p-8 border border-border/50 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-black italic flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-primary" />
                   Publishing
                 </h3>
                 <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                   Draft
                 </div>
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full btn-primary h-14 rounded-2xl flex items-center justify-center gap-3 text-base font-black shadow-xl shadow-primary/30 active:scale-95 disabled:opacity-50 transition-all mb-4"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Publish Now
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black text-center uppercase tracking-widest italic mb-4"
                >
                  {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black text-center uppercase tracking-widest italic mb-4"
                >
                  {success}
                </motion.div>
              )}
              
              <p className="text-[10px] text-muted-foreground text-center font-bold uppercase tracking-widest italic">
                Final step: share your story
              </p>
            </div>
            
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
