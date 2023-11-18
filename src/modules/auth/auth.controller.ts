import type {Request, Response} from 'express'

import * as AuthService from './auth.service'

import {buildSuccessResponse, build500Response} from '../../utils'
import {AuthControllerResponse} from './types'

import {REFRESH_TOKEN_COOKIE} from './constants'

export async function login(req: Request, res: Response) {
	try {
		const userId = req.user!.id
		const tokens = await AuthService.login(userId)

		const response: AuthControllerResponse = {
			token: (tokens).accessToken
		}

		return res
			.status(200)
			.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
				secure: true,
				httpOnly: true,
				maxAge: Date.now() + 24 * 60 * 60 * 1000
			})
			.json(buildSuccessResponse(response))
	} catch (e) {
		console.error(e)
		return res.status(500).json(build500Response())
	}
}

export async function refresh(req: Request, res: Response) {
	try {
		const userId = req.user!.id
		const tokens = await AuthService.refresh(userId)

		const response: AuthControllerResponse = {
			token: tokens.accessToken
		}

		return res
			.status(200)
			.json(buildSuccessResponse(response))
	} catch (e) {
		console.error(e)
		return res.status(500).json(build500Response())
	}
}
