import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":id"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projects)[":id"]["$delete"]
>["param"];

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (param) => {
      const res = await client.api.projects[":id"].$delete({
        param,
      });

      if (!res.ok) {
        throw new Error("Failed to delete project");
      }

      return await res.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", { id: data.id }] });
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
};
