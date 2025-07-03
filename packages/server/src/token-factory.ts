import * as jose from "jose";
import type { TokenPayload } from "shared";

export const ACCESS_TOKEN_SECRET_ENCODED = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET ?? "");

export async function createToken(payload: TokenPayload) {
	const accessToken = await new jose.SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().sign(ACCESS_TOKEN_SECRET_ENCODED);

	return accessToken;
}

export async function verifyToken(token: string, secret: Uint8Array = ACCESS_TOKEN_SECRET_ENCODED) {
	try {
		const jwt = await jose.jwtVerify<TokenPayload>(token, secret);

		if (!("id" in jwt.payload) && !("providerId" in jwt.payload)) {
			return { valid: false, payload: null };
		}

		return { valid: true, payload: jwt.payload };
	} catch (_e) {
		return { valid: false, payload: null };
	}
}
