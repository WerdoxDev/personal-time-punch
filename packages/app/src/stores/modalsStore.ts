import { produce } from "immer";
import type { ReactNode } from "react";
import type { APIWork, DeepPartial } from "shared";
import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

const initialStore = () => ({
	info: { isOpen: false, status: "none" as "none" | "info" | "error" | "warn", title: "", text: "" as ReactNode, onConfirm: undefined as (() => (void) | Promise<void>) | undefined },
	createWork: { isOpen: false },
	editWork: { isOpen: false, work: undefined as APIWork | undefined },
	downloadReport: { isOpen: false }
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
