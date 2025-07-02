import * as path from "node:path";
// import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-oxc";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

// const reactCompilerConfig = { target: "19" };

// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	plugins: [
		// reactRouterDevTools(),
		react(),
		// reactRouter(),
		Icons({
			compiler: "jsx",
		}),
		AutoImport({
			resolvers: [IconsResolver({ prefix: "Icon", extension: "jsx" })],
		}),
		tailwindcss(),
	],

	resolve: {
		alias: {
			"@": path.join(__dirname, "./src"),
			"@lib": path.join(__dirname, "./src/lib"),
			"@hooks": path.join(__dirname, "./src/hooks"),
			"@contexts": path.join(__dirname, "./src/contexts"),
			"@components": path.join(__dirname, "./src/components"),
			"@stores": path.join(__dirname, "./src/stores"),
		},
	},
	clearScreen: false,
	build: {
		target: "esnext",
		outDir: "./dist",
	},
});
