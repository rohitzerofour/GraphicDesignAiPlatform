import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)["$post"]
>["json"];

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.projects.$post({ json });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      return await res.json();
    },
    onSuccess: () => {
      toast.success("Project created successfully!");

      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
};
