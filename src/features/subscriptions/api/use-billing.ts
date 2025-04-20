import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions.billing)["$post"],
  200
>;

export const useBilling = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const res = await client.api.subscriptions.billing.$post();

      if (!res.ok) {
        throw new Error("Failed to create session");
      }

      return await res.json();
    },
    onSuccess: ({ data }) => {
      window.location.href = data;
    },
    onError: () => {
      toast.error("Failed to create session");
    },
  });
};
