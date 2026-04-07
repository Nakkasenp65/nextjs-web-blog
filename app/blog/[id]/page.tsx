import React from "react";
import { Metadata } from "next";
import { getBlogById } from "@/actions/blogActions";
import BlogDetailsClient from "./BlogDetailsClient";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const blog = await getBlogById(params.id);
  
  return {
    title: blog?.title || "Blog Details",
    description: blog?.excerpt || "Read more about this story on WriteBlog.",
    openGraph: {
      title: blog?.title,
      description: blog?.excerpt,
      images: blog?.image?.url ? [blog.image.url] : [],
    },
  };
}

const BlogDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  
  return (
    <BlogDetailsClient id={params.id} />
  );
};

export default BlogDetailsPage;
