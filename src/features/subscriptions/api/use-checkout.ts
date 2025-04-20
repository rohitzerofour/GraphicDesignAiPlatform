import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.subscriptions.checkout)["$post"],
  200
>;

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const res = await client.api.subscriptions.checkout.$post();

      if (!res.ok) {
        throw new Error("Failed to create session");
      }

      return await res.json();
    },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: () => {
      toast.error("Failed to create session");
    },
  });
};
