import {Router} from 'express'

import * as UsersController from './users.controller'

import {
	createUserSchemaValidator,
	createUserUniqueEmailValidator
} from './middlewares'

export const usersRouter = Router()

usersRouter
	.route('/')
	.post(
		createUserSchemaValidator,
		createUserUniqueEmailValidator,
		UsersController.createUser
	)
