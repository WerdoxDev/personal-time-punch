import { createHashRouter } from "react-router";
import Root, { rootLoader } from "./root";
import App from "./routes/app/app";
import AppLayout from "./routes/app/app-layout";
import AuthLayout from "./routes/auth/auth-layout";
import Login from "./routes/auth/login";
import Register from "./routes/auth/register";
import Layout from "./routes/layout";

const router = createHashRouter([
	{
		path: "/",
		Component: Root,
		loader: rootLoader,
		children: [
			{
				Component: Layout,
				children: [
					{
						Component: AuthLayout,
						children: [
							{
								path: "/register",
								Component: Register,
							},
							{
								path: "/login",
								Component: Login,
							},
						],
					},
					{
						Component: AppLayout,
						children: [
							{
								path: "/app",
								Component: App,
							},
						],
					},
				],
			},
		],
	},
]);

export default router;
