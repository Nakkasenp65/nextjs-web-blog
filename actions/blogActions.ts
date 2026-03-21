"use server";

import { connect } from "@/lib/db";
import Blog from "@/models/Blog";
import { revalidatePath } from "next/cache";

export async function getBlogById(id: string) {
  await connect();
  const blog = await Blog.findById(id).populate("authorId").populate("comments.user").lean();
  return JSON.parse(JSON.stringify(blog));
}

export async function createBlog(data: any) {
  await connect();
  const newBlog = await Blog.create(data);
  revalidatePath("/blog");
  return JSON.parse(JSON.stringify(newBlog));
}

export async function updateBlog(id: string, data: any) {
  await connect();
  const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true }).lean();
  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  return JSON.parse(JSON.stringify(updatedBlog));
}

export async function deleteBlog(id: string) {
  await connect();
  await Blog.findByIdAndDelete(id);
  revalidatePath("/blog");
  return { success: true };
}

export async function likeBlog(blogId: string, userId: string) {
  await connect();
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  if (blog.likes.includes(userId)) {
    blog.likes = blog.likes.filter((id: any) => id.toString() !== userId.toString());
  } else {
    blog.likes.push(userId);
  }

  await blog.save();
  revalidatePath(`/blog/${blogId}`);
  return { success: true, likes: blog.likes.length };
}

export async function addComment(blogId: string, userId: string, text: string) {
  await connect();
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  blog.comments.push({
    user: userId,
    text,
  });

  await blog.save();
  revalidatePath(`/blog/${blogId}`);
  return JSON.parse(JSON.stringify(blog.comments[blog.comments.length - 1]));
}

export async function deleteComment(blogId: string, commentId: string) {
  await connect();
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  blog.comments = blog.comments.filter((comment: any) => comment.id !== commentId);
  await blog.save();
  revalidatePath(`/blog/${blogId}`);
  return { success: true };
}
