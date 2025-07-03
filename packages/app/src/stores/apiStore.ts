import type { APIUser } from "shared";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

const store = createStore(
	combine(
		{
			token: "",
			user: undefined as APIUser | undefined,
		},
		(set) => ({
			initialize: (token: string, user: APIUser) => set({ token, user }),
			setUser: (user?: APIUser) => set({ user }),
			setToken: (token: string) => set({ token }),
		}),
	),
);

export const apiStore = store;

export function useAPI() {
	return useStore(store);
}
