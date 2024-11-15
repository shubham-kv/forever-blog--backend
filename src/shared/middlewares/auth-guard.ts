import jwt, {JwtPayload} from 'jsonwebtoken'
import type {NextFunction, Request, Response} from 'express'

import {User, UserEntity} from '../../shared/modules/user'
import {tokenConfig} from '../../configs'
import {buildErrorResponse} from '../../utils'

import {UNAUTHORIZED_MESSAGE} from '../constants'

export async function authGuard(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authHeader = req.headers.authorization
	const matchesPattern = authHeader ? /^Bearer [^\s]+$/.test(authHeader) : false

	if (!matchesPattern) {
		return res.status(401).json(buildErrorResponse(UNAUTHORIZED_MESSAGE))
	}

	const token = authHeader?.split(' ')[1]

	try {
		const decoded = jwt.verify(
			token as string,
			tokenConfig.accessTokenSecret
		) as JwtPayload

		const userId = decoded.sub!
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
