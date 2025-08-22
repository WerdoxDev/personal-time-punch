import { apiRequest } from "@lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Snowflake } from "shared";

export function useDeleteWork() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(data: Snowflake) {
            const result = await apiRequest(`/work/${data}`, "DELETE", undefined, localStorage.getItem("token"));
            if (result.status !== 200) {
                return false;
            }

            return true;
        },

        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["works"] });
        }
    });

    return mutation;
}