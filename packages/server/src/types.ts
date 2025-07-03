import type { TokenPayload } from "shared";

declare module "hono" {
	interface ContextVariableMap {
		tokenPayload: TokenPayload;
		token: string;
	}
}
