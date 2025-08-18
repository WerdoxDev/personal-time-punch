import { apiRequest } from "@lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { APIPatchWorkJSONBody, APIPostWorkResult } from "shared";

export function useUpdateWork() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(data: APIPatchWorkJSONBody) {
            const result = await apiRequest(`/work/${data.id}`, "PATCH", data, localStorage.getItem("token"));
            if (result.status !== 200) {
                return undefined;
            }

            const json = await result.json() as APIPostWorkResult;
            queryClient.setQueryData(["work", json.id], json);
            return json;
        },
    });

    return mutation;
}