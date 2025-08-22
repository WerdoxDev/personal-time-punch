import { queryOptions } from "@tanstack/react-query";
import type { APIGetLatestWorkResult, APIGetWorkResult, APIGetWorksResult, Snowflake } from "shared";
import { apiRequest } from "./utils";

export function getWorkOptions(workId: Snowflake, enabled?: boolean) {
    return queryOptions({
        queryKey: ["work", workId],
        queryFn: async () => {
            const result = await apiRequest(`/work/${workId}`, "GET", undefined, localStorage.getItem("token"));

            if (result.status !== 200) {
                throw new Error(`Failed to get work with id ${workId}`);
            }
            return (await result.json()) as APIGetWorkResult;
        },
        retry: false,
        enabled,
    });
}

export function getLatestWorkOptions(enabled?: boolean) {
    return queryOptions({
        queryKey: ["latest-work"],
        queryFn: async () => {
            const result = await apiRequest("/work/latest", "GET", undefined, localStorage.getItem("token"));

            if (result.status !== 200) {
                throw new Error("Failed to get work");
            }
            return (await result.json()) as APIGetLatestWorkResult;
        },
        retry: false,
        enabled,
    });
}

export function getWorksOptions() {
    return queryOptions({
        queryKey: ["works"],
        queryFn: async () => {
            const result = await apiRequest("/works", "GET", undefined, localStorage.getItem("token"));

            if (result.status !== 200) {
                throw new Error("Failed to get user works");
            }
            return (await result.json()) as APIGetWorksResult;
        },
        refetchOnMount: true,
    });
}
