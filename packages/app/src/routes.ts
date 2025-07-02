import { createHashRouter } from "react-router";
import Root from "./root";
import Index from "./routes/index";

const router = createHashRouter([
	{
		Component: Root,
		children: [
			{
				path: "/",
				Component: Index,
			},
		],
	},
]);

export default router;
