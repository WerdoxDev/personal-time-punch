const require_chunk = require("./chunk-BdmL_oXl.cjs");
const electron = require_chunk.__toESM(require("electron"));
const electronAPI = {};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
exports.electronAPI = electronAPI;
