"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/actions/userActions";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}
