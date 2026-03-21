import { z } from "zod";

export const UserSignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const BlogSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  quote: z.string().min(6, "Quote must be at least 6 characters"),
  category: z.enum(["Tech", "Entertainment", "Sports", "Health", "Animals"]),
  image: z.object({
    id: z.string(),
    url: z.string(),
  }).optional(),
});

export const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  designation: z.string().optional(),
  age: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
});

export const CommentSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty"),
});
