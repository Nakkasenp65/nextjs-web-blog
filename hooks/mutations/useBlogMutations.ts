"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  likeBlog, 
  addComment, 
  deleteComment, 
  createBlog, 
  updateBlog, 
  deleteBlog 
} from "@/actions/blogActions";

export function useLikeBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, userId }: { blogId: string; userId: string }) => 
      likeBlog(blogId, userId),
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, userId, text }: { blogId: string; userId: string; text: string }) => 
      addComment(blogId, userId, text),
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ blogId, commentId }: { blogId: string; commentId: string }) => 
      deleteComment(blogId, commentId),
    onSuccess: (_, { blogId }) => {
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] });
    },
  });
}

export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Invalidate all blogs list
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBlog(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["blog", id] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });
}
