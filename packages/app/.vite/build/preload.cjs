const require_chunk = require("./chunk-BdmL_oXl.cjs");
const electron = require_chunk.__toESM(require("electron"));
const electronAPI = {
	minimize: () => electron.ipcRenderer.send("window:minimize"),
	showMain: () => electron.ipcRenderer.send("window:show-main"),
	hideMain: () => electron.ipcRenderer.send("window:hide-main"),
	toggleMaximize: () => electron.ipcRenderer.send("window:toggle-maximize"),
	onMaximizedChanged: (callback) => {
		electron.ipcRenderer.on("window:is-maximized", callback);
		return () => electron.ipcRenderer.off("window:is-maximized", callback);
	}
};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
exports.electronAPI = electronAPI;
