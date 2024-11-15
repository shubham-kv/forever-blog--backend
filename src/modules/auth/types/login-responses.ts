export type AuthControllerResponse = {
	token: string
}

export type LoginServiceResponse = {
	accessToken: string
	refreshToken: string
}

export type RefreshServiceResponse = {
	accessToken: string
}
