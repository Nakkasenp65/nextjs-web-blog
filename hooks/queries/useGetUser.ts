"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/actions/userActions";
import { IUser } from "@/types";

export function useGetUser(id: string | undefined) {
  return useQuery<IUser>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  });
}
