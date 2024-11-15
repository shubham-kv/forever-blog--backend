import {Router} from 'express'

import * as usersController from './users.controller'

import {
	createUserSchemaValidator,
	createUserUniqueEmailValidator
} from './middlewares'

import {applyMiddlewareWrapper} from '../../utils'

export const usersRouter = Router()

const createUserMiddlewares = applyMiddlewareWrapper(
	createUserSchemaValidator,
	createUserUniqueEmailValidator,
	usersController.createUser
)

usersRouter.route('/').post(...createUserMiddlewares)
