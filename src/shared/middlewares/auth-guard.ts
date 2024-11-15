import jwt, {JwtPayload} from 'jsonwebtoken'
import type {Request, RequestHandler} from 'express'

import {User, UserEntity} from '../../shared/modules/user'
import {tokenConfig} from '../../configs'

import {UnauthorizedError} from '../errors'

export const authGuard: RequestHandler = async (req: Request, _res, next) => {
	const authHeader = req.headers.authorization
	const matchesPattern = authHeader ? /^Bearer [^\s]+$/.test(authHeader) : false

	if (!matchesPattern) {
		throw new UnauthorizedError()
	}

	const token = authHeader?.split(' ')[1]
	let decoded: JwtPayload

	try {
		decoded = jwt.verify(
			token as string,
			tokenConfig.accessTokenSecret
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
