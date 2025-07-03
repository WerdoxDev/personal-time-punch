import { createStore, useStore } from "zustand";
import { combine } from "zustand/middleware";

const store = createStore(
	combine(
		{
			maximized: false,
		},
		(set) => ({
			setMaximized: (isMaximized: boolean) => set({ maximized: isMaximized }),
		}),
	),
);

export function initializeWindow() {
	const unlisten = window.electronAPI.onMaximizedChanged((_, isMaximized) => {
		store.getState().setMaximized(isMaximized);
	});

	return () => {
		unlisten();
	};
}

export function useWindow() {
	return useStore(store);
}
