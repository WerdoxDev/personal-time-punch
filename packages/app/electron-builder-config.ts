import type { Configuration } from "electron-builder";

export default {
	productName: "Personal Time Punch",
	appId: "dev.matin.personaltimepunch",
	electronLanguages: ["de-DE", "en-US"],
	compression: "store",

	win: {
		target: { target: "nsis", arch: ["x64"] },
		// publish: {
		// 	provider: "generic",
		// 	url: "https://midgard.huginn.dev/api/update/${os}",
		// 	useMultipleRangeRequest: false,
		// },
		icon: "assets/icon.ico",
	},
	artifactName: "${productName}_${version}_${arch}-setup.${ext}",
	files: ["dist/**/*", "!dist/electron", "!node_modules/**/*", ".vite/build/**/*"],
	directories: {
		output: "dist/electron",
	},
	icon: "assets/icon.ico",
	extraResources: ["assets"],
} as Configuration;
