import { queryOptions } from "@tanstack/react-query";
import type { APIGetWorkResult, Snowflake } from "shared";
import { apiRequest } from "./utils";

export function getWorkOptions(workId: Snowflake, enabled?: boolean) {
    return queryOptions({
        queryKey: ["work", workId],
        queryFn: async () => {
            const result = await apiRequest(`/work/${workId}`, "GET", undefined, localStorage.getItem("token"));

            if (result.status !== 200) {
                throw new Error(`Failed to get work with id ${workId}`);
            }
            return await result.json() as APIGetWorkResult;
        },
        retry: false,
        enabled,
    });
}
