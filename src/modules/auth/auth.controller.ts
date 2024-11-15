import type {Request, Response} from 'express'

import * as AuthService from './auth.service'

import {buildSuccessResponse, build500Response} from '../../utils'
import {LoginControllerResponse} from './types'

import {REFRESH_TOKEN_COOKIE} from './constants'

export async function login(req: Request, res: Response) {
	try {
		const {accessToken, refreshToken} = await AuthService.login(
			(req as any).user
		)

		const response: LoginControllerResponse = {
			token: accessToken
		}

		return res
			.status(200)
			.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
				secure: true,
				httpOnly: true,
				maxAge: Date.now() + 24 * 60 * 60 * 1000
			})
			.json(buildSuccessResponse(response))
	} catch (e: any) {
		console.error(e)
		return res.status(500).json(build500Response())
	}
}
