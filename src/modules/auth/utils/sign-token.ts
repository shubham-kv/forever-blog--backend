import jwt, {JwtPayload} from 'jsonwebtoken'

export function signToken(
	payload: JwtPayload,
	secret: string,
	expiresIn: string | number | undefined
) {
	return jwt.sign(payload, secret, {expiresIn})
}
