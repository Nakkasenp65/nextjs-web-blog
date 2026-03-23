"use client";

import { useQuery } from "@tanstack/react-query";
import { getBlogById } from "@/actions/blogActions";
import { IBlog } from "@/types";

export function useGetBlogById(id: string) {
  return useQuery<IBlog>({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: !!id,
  });
}
