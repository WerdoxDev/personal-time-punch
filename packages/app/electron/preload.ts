import { contextBridge, ipcRenderer } from "electron";

export const electronAPI = {
	minimize: () => ipcRenderer.send("window:minimize"),
	showMain: () => ipcRenderer.send("window:show-main"),
	hideMain: () => ipcRenderer.send("window:hide-main"),
	toggleMaximize: () => ipcRenderer.send("window:toggle-maximize"),
	resize: (width: number, height: number) => ipcRenderer.send("window:resize", width, height),
	onMaximizedChanged: (callback: (_event: Electron.IpcRendererEvent, isMaximized: boolean) => void) => {
		ipcRenderer.on("window:is-maximized", callback);
		return () => ipcRenderer.off("window:is-maximized", callback);
	},
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
