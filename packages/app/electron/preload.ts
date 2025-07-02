import { contextBridge } from "electron";

export const electronAPI = {};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
