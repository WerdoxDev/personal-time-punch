import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { importRoutes } from "./router-importer";
import { setAppInstance } from "./utils";

const app = new Hono().use(cors());
setAppInstance(app);

export { app };

await importRoutes();
app.get("/update/win/*", serveStatic({
    root: "./update", rewriteRequestPath: (path) => {
        console.log(path);
        return path.replace("/update/win", "")
    }
}));
showRoutes(app, { colorize: true });

const _server = Bun.serve({ fetch: app.fetch, hostname: process.env.SERVER_HOST, port: process.env.SERVER_PORT });
