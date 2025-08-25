import path from "node:path";
import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from "electron";

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
	console.log("app:electron", "electron:default", "exit because of lock");

	app.exit();
}

app.on("ready", async () => {
	console.log("app:electron", "electron:recv", "app ready");

	if (!gotLock) {
		return;
	}

	createWindow();

	// Setup as Startup App
	console.log("app:electron", "electron:default", "set startup");
	app.setLoginItemSettings({ openAtLogin: true, path: app.getPath("exe"), args: ["--silent"] });
});

app.on("window-all-closed", () => {
	console.log("app:electron", "electron:recv", "app all windows closed");

	if (process.platform !== "darwin") {
		app.quit();
	}
});

function createWindow() {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
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
			preload: path.join(__dirname, "preload.cjs"),
		},
		show: true,
	});

	if (process.env.VITE_DEV_SERVER_URL) {
		console.log("app:electron", "electron:default", "load", "url:", process.env.VITE_DEV_SERVER_URL);

		mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
	} else {
		const filePath = path.join(__dirname, "../../dist/index.html");
		console.log("app:electron", "electron:default", "load", "url:", filePath);

		mainWindow.loadFile(filePath);
	}

	// Open the DevTools.
	// mainWindow.webContents.openDevTools({ mode: "undocked" });

	eventListeners(mainWindow);
	configureTray(mainWindow);
}

function configureTray(mainWindow: BrowserWindow) {
	console.log("app:electron", "electron:default", "configure tray");

	const tray = new Tray(app.isPackaged ? path.join(process.resourcesPath, "assets", "icon.ico") : "./assets/icon.ico");
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Quit",
			type: "normal",
			click: () => {
				app.exit();
			},
		},
	]);

	tray.setContextMenu(contextMenu);
	tray.setToolTip("Personal Time Punch");

	tray.on("click", () => {
		mainWindow.show();
	});
}

function eventListeners(mainWindow: BrowserWindow) {
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

	ipcMain.on("window:resize", (_, width: number, height: number) => {
		mainWindow.setSize(width, height);
	})

	ipcMain.on("window:show-main", () => {
		console.log("app:electron", "electron:recv", "window show main");

		mainWindow.show();
	});

	ipcMain.on("window:hide-main", () => {
		console.log("app:electron", "electron:recv", "window hide main");

		mainWindow.hide();
	});

	ipcMain.on("window:minimize", () => {
		console.log("app:electron", "electron:recv", "window minimize");

		mainWindow.minimize();
	});

	ipcMain.on("window:toggle-maximize", () => {
		console.log("app:electron", "electron:recv", "window toggle maximize");

		if (mainWindow.isMaximized()) {
			mainWindow.restore();
		} else {
			mainWindow.maximize();
		}
	});

	ipcMain.on("shell:open-external", (_, url: string) => {
		console.log("app:electron", "recv", "shell open external", "url:", url);

		shell.openExternal(url);
	});

}
