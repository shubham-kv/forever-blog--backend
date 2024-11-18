type CookieConfig = {
	refreshCookieName: string
	refreshCookieAge: number
}

export const cookieConfig: CookieConfig = {
	refreshCookieName: process.env.REFRESH_COOKIE_NAME,
	refreshCookieAge: 2 * 24 * 60 * 60 * 1000 // 2d
}
