import bcrypt from 'bcrypt'
import type {Request, RequestHandler} from 'express'

import {LoginDto} from '../dto'
import {User, UserEntity} from '../../../shared/modules/user'

import {BadRequestError} from '../../../shared/errors'
import {INVALID_CREDENTIALS_MESSAGE} from '../constants'

export const loginCredentialsValidator: RequestHandler = async (
	req: Request,
	_res,
	next
) => {
	const {email, password} = req.body as LoginDto
	const userDocument = await User.findOne({email})

	if (!userDocument) {
		throw new BadRequestError(INVALID_CREDENTIALS_MESSAGE)
	}

	const isPasswordValid = await bcrypt.compare(password, userDocument.password)

	if (!isPasswordValid) {
		throw new BadRequestError(INVALID_CREDENTIALS_MESSAGE)
	}

	const {id, firstName, lastName} = userDocument
	req.user = new UserEntity({id, firstName, lastName, email})

	next()
}
