import bcrypt from 'bcrypt'
import type {Request} from 'express'

import {User, UserEntity} from '../../../shared/modules/user'

import {BadRequestError} from '../../../shared/errors'
import {INVALID_CREDENTIALS_MESSAGE} from '../constants'
import {LoginHandler} from '../types'

export const loginCredentialsValidator: LoginHandler = async (req, _, next) => {
	const {email, password} = req.body
	const userDocument = await User.findOne({email})

	if (!userDocument) {
		throw new BadRequestError(INVALID_CREDENTIALS_MESSAGE)
	}

	const isPasswordValid = await bcrypt.compare(password, userDocument.password)

	if (!isPasswordValid) {
		throw new BadRequestError(INVALID_CREDENTIALS_MESSAGE)
	}

	const {id, firstName, lastName} = userDocument
	;(req as Request).user = new UserEntity({id, firstName, lastName, email})

	next()
}
