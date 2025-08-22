const require_chunk = require("./chunk-CUT6urMc.cjs");
const node_path = require_chunk.__toESM(require("node:path"));
const electron = require_chunk.__toESM(require("electron"));
const gotLock = electron.app.requestSingleInstanceLock();
if (!gotLock) {
	console.log("app:electron", "electron:default", "exit because of lock");
	electron.app.exit();
}
electron.app.on("ready", async () => {
	console.log("app:electron", "electron:recv", "app ready");
	if (!gotLock) return;
	createWindow();
	console.log("app:electron", "electron:default", "set startup");
	electron.app.setLoginItemSettings({
		openAtLogin: true,
		path: electron.app.getPath("exe"),
		args: ["--silent"]
	});
});
electron.app.on("window-all-closed", () => {
	console.log("app:electron", "electron:recv", "app all windows closed");
	if (process.platform !== "darwin") electron.app.quit();
});
function createWindow() {
	const mainWindow = new electron.BrowserWindow({
		minWidth: 480,
		minHeight: 480,
		width: 480,
		height: 480,
		fullscreen: false,
		frame: false,
		titleBarStyle: "hidden",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: true,
			preload: node_path.default.join(__dirname, "preload.cjs")
		},
		show: true
	});
	if (process.env.VITE_DEV_SERVER_URL) {
		console.log("app:electron", "electron:default", "load", "url:", process.env.VITE_DEV_SERVER_URL);
		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		const filePath = node_path.default.join(__dirname, "../../dist/index.html");
		console.log("app:electron", "electron:default", "load", "url:", filePath);
		mainWindow.loadFile(filePath);
	}
	eventListeners(mainWindow);
	configureTray(mainWindow);
}
function configureTray(mainWindow) {
	console.log("app:electron", "electron:default", "configure tray");
	const tray = new electron.Tray(electron.app.isPackaged ? node_path.default.join(process.resourcesPath, "assets", "icon.ico") : "./assets/icon.ico");
	const contextMenu = electron.Menu.buildFromTemplate([{
		label: "Quit",
		type: "normal",
		click: () => {
			electron.app.exit();
		}
	}]);
	tray.setContextMenu(contextMenu);
	tray.setToolTip("Personal Time Punch");
	tray.on("click", () => {
		mainWindow.show();
	});
}
function eventListeners(mainWindow) {
	mainWindow.on("close", (e) => {
		console.log("app:electron", "electron:recv", "close");
		e.preventDefault();
		mainWindow.hide();
	});
	mainWindow.on("maximize", () => {
		console.log("app:electron", "electron:recv", "maximize");
		console.log("app:electron", "electron:send", "window is maximized", true);
		mainWindow.webContents.send("window:is-maximized", true);
	});
	mainWindow.on("unmaximize", () => {
		console.log("app:electron", "electron:recv", "unmaximize");
		console.log("app:electron", "electron:send", "window is maximized", false);
		mainWindow.webContents.send("window:is-maximized", false);
	});
	mainWindow.on("restore", () => {
		console.log("app:electron", "electron:recv", "restore");
		console.log("app:electron", "electron:send", "window is maximized", false);
		mainWindow.webContents.send("window:is-maximized", false);
	});
	electron.ipcMain.on("window:resize", (_, width, height) => {
		mainWindow.setSize(width, height);
	});
	electron.ipcMain.on("window:show-main", () => {
		console.log("app:electron", "electron:recv", "window show main");
		mainWindow.show();
	});
	electron.ipcMain.on("window:hide-main", () => {
		console.log("app:electron", "electron:recv", "window hide main");
		mainWindow.hide();
	});
	electron.ipcMain.on("window:minimize", () => {
		console.log("app:electron", "electron:recv", "window minimize");
		mainWindow.minimize();
	});
	electron.ipcMain.on("window:toggle-maximize", () => {
		console.log("app:electron", "electron:recv", "window toggle maximize");
		if (mainWindow.isMaximized()) mainWindow.restore();
		else mainWindow.maximize();
	});
}
