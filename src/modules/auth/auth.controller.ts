import type {Request} from 'express'
import * as authService from './auth.service'

import {appConfig, cookieConfig} from '../../configs'
import {buildSuccessResponse} from '../../utils'

import {
	AuthResponse,
	LoginHandler,
	LoginResponse,
	RefreshHandler
} from './types'

export const login: LoginHandler = async (req, res) => {
	const userId = (req as Request).user!.id
	const tokens = await authService.login(userId)

	const response: LoginResponse = {
		token: tokens.accessToken,
		user: req.user!
	}

	res
		.status(200)
		.cookie(cookieConfig.refreshCookieName, tokens.refreshToken, {
			secure: appConfig.isProdEnv,
			httpOnly: true,
			maxAge: Date.now() + cookieConfig.refreshCookieAge
		})
		.json(buildSuccessResponse(response))
}

export const refresh: RefreshHandler = async (req, res) => {
	const userId = (req as Request).user!.id
	const tokens = await authService.refresh(userId)

	const response: AuthResponse = {
		token: tokens.accessToken
	}

	res.status(200).json(buildSuccessResponse(response))
}
