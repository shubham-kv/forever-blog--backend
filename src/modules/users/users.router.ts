import {Router} from 'express'

import * as usersController from './users.controller'

import {
	createUserSchemaValidator,
	createUserUniqueEmailValidator
} from './middlewares'

import {middlewareWrapper} from '../../utils'

export const usersRouter = Router()

usersRouter
	.route('/')
	.post(
		middlewareWrapper(createUserSchemaValidator),
		middlewareWrapper(createUserUniqueEmailValidator),
		middlewareWrapper(usersController.createUser)
	)
