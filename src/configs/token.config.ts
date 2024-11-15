type TokenConfig = {
	accessTokenSecret: string
	accessTokenExpiresIn: string
	refreshTokenSecret: string
	refreshTokenExpiresIn: string
}

export const tokenConfig: TokenConfig = {
	accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
	accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
	refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string
}
