import jwt, {JwtPayload} from 'jsonwebtoken'
import type {NextFunction, Request, Response} from 'express'

import {tokenConfig} from '../../../configs'
import {buildErrorResponse} from '../../../utils'

import {REFRESH_TOKEN_COOKIE, UNAUTHORIZED_MESSAGE} from '../constants'

export async function refreshGuard(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE]

	if (!refreshToken) {
		return res.status(401).json(buildErrorResponse(UNAUTHORIZED_MESSAGE))
	}

	try {
		const decoded = jwt.verify(
			refreshToken,
			tokenConfig.refreshTokenSecret
		) as JwtPayload

		req.user = {
			id: decoded.sub!
		}

		return next()
	} catch (e) {
		return res.status(401).json(buildErrorResponse(UNAUTHORIZED_MESSAGE))
	}
}
