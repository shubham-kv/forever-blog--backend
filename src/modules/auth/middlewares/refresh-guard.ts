import jwt, {JwtPayload} from 'jsonwebtoken'
import type {Request, RequestHandler} from 'express'

import {User, UserEntity} from '../../../shared/modules/user'
import {cookieConfig, tokenConfig} from '../../../configs'
import {UnauthorizedError} from '../../../shared/errors'

export const refreshGuard: RequestHandler = async (
	req: Request,
	_res,
	next
) => {
	const refreshToken = req.cookies[cookieConfig.refreshCookieName]

	if (!refreshToken) {
		throw new UnauthorizedError()
	}

	let decoded: JwtPayload

	try {
		decoded = jwt.verify(
			refreshToken,
			tokenConfig.refreshTokenSecret
		) as JwtPayload
	} catch {
		throw new UnauthorizedError()
	}

	const userId = decoded.sub
	const userDocument = await User.findById(userId)

	if (!userDocument) {
		throw new UnauthorizedError()
	}

	const {id, firstName, lastName, email} = userDocument
	req.user = new UserEntity({id, firstName, lastName, email})

	next()
}
