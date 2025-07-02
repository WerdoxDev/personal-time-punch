import path from "node:path";
import { app, BrowserWindow, Menu, Tray } from "electron";

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
		minWidth: 800,
		minHeight: 480,
		width: 800,
		height: 480,
		fullscreen: false,
		frame: false,
		// titleBarStyle: "hidden",
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
	mainWindow.webContents.openDevTools({ mode: "undocked" });

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

function eventListeners(mainWindow: BrowserWindow) {}
