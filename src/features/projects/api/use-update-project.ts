import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":id"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":id"]["$patch"]
>["json"];

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["project", { id }],
    mutationFn: async (json) => {
      const res = await client.api.projects[":id"].$patch({
        json,
        param: { id },
      });

      if (!res.ok) {
        throw new Error("Failed to update project");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { id }] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
};
