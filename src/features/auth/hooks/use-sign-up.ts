import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.users)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.users)["$post"]>["json"];

export const useSignUp = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.users.$post({ json });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Account created successfully");
    },
  });
};
