import { apiRequest } from "@lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { APIPostWorkJSONBody, APIPostWorkResult } from "shared";

export function useCreateWork() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        async mutationFn(data: APIPostWorkJSONBody) {
            const result = await apiRequest("/work", "POST", data, localStorage.getItem("token"));
            if (result.status !== 201) {
                return undefined;
            }

            const json = (await result.json()) as APIPostWorkResult;
            queryClient.setQueryData(["work", json.id], json);
            return json;
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["works"] });
        }
    });

    return mutation;
}
