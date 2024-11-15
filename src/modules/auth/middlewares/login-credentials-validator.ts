import bcrypt from 'bcrypt'
import type {NextFunction, Request, Response} from 'express'

import {LoginDto} from '../dto'
import {User} from '../../users'
import {buildErrorResponse} from '../../../utils'

import {INVALID_CREDENTIALS_MESSAGE} from '../constants'

export async function loginCredentialsValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const {email, password} = req.body as LoginDto
	const user = await User.findOne({email})

	if (user) {
		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (isPasswordValid) {
			;(req as any).user = {
				id: user._id.toString()
			}
			return next()
		}
	}

	return res.status(400).json(buildErrorResponse(INVALID_CREDENTIALS_MESSAGE))
}
