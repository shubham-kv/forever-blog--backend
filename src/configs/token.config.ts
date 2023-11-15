type TokenConfig = {
	accessTokenSecret: string
	accessTokenExpiresIn: string
	refreshTokenSecret: string
	refreshTokenExpiresIn: string
}

export const tokenConfig: TokenConfig = {
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
	accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '',
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? '',
	refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? ''
}
