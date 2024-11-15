import jwt, {JwtPayload} from 'jsonwebtoken'
import type {NextFunction, Request, Response} from 'express'

import {User, UserEntity} from '../../../../src/shared/modules/user'
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

		const userId = decoded.sub
		const userDocument = await User.findById(userId)

		if (!userDocument) {
			return res.status(401).json(buildErrorResponse(UNAUTHORIZED_MESSAGE))
		}

		const {id, firstName, lastName, email} = userDocument
		req.user = new UserEntity({id, firstName, lastName, email})

		return next()
	} catch (e) {
		return res.status(401).json(buildErrorResponse(UNAUTHORIZED_MESSAGE))
	}
}
