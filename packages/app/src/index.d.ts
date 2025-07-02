import type { electronAPI } from "../electron/preload";

declare global {
	interface Window {
		electronAPI: typeof electronAPI;
	}
}
