import { produce } from "immer";
import type { DeepPartial } from "shared";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

const initialStore = () => ({
	info: { isOpen: false, status: "none" as "none" | "info" | "error", title: "", text: "" },
});

type StoreType = ReturnType<typeof initialStore>;

const store = createStore(
	combine(initialStore(), (set) => ({
		updateModals: (action: DeepPartial<StoreType>) =>
			set(
				produce((draft: StoreType) => {
					for (const [key, value] of Object.entries(action)) {
						const actualKey = key as keyof typeof draft;
						Object.assign(draft[actualKey], value);
					}
				}),
			),
	})),
);

export function useModals() {
	return useStore(store);
}
