import {Router} from 'express'

import * as usersController from './users.controller'

import {
	createUserSchemaValidator,
	createUserUniqueEmailValidator
} from './middlewares'

import {requestWrapper} from '../../utils'

export const usersRouter = Router()

usersRouter
	.route('/')
	.post(
		requestWrapper(createUserSchemaValidator),
		requestWrapper(createUserUniqueEmailValidator),
		requestWrapper(usersController.createUser)
	)
