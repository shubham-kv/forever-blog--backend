import bcrypt from 'bcrypt'
import type {NextFunction, Request, Response} from 'express'

import {LoginDto} from '../dto'
import {User, UserEntity} from '../../../shared/modules/user'
import {buildErrorResponse} from '../../../utils'

import {INVALID_CREDENTIALS_MESSAGE} from '../constants'

export async function loginCredentialsValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const {email, password} = req.body as LoginDto
	const userDocument = await User.findOne({email})

	if (userDocument) {
		const isPasswordValid = await bcrypt.compare(password, userDocument.password)

		if (isPasswordValid) {
			const {id, firstName, lastName, email} = userDocument
			req.user = new UserEntity({id, firstName, lastName, email})

			return next()
		}
	}

	return res.status(400).json(buildErrorResponse(INVALID_CREDENTIALS_MESSAGE))
}
