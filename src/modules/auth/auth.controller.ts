import type {Request} from 'express'

import * as authService from './auth.service'

import {buildSuccessResponse} from '../../utils'

import {
	AuthResponse,
	LoginHandler,
	LoginResponse,
	RefreshHandler
} from './types'

import {REFRESH_TOKEN_COOKIE} from './constants'

export const login: LoginHandler = async (req, res) => {
	const userId = (req as Request).user!.id
	const tokens = await authService.login(userId)

	const response: LoginResponse = {
		token: tokens.accessToken,
		user: req.user!
	}

	res
		.status(200)
		.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
			secure: true,
			httpOnly: true,
			maxAge: Date.now() + 24 * 60 * 60 * 1000
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
