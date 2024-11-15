import {Router} from 'express'

import * as authController from './auth.controller'
import {
	loginSchemaValidator,
	loginCredentialsValidator,
	refreshGuard
} from './middlewares'

import {middlewareWrapper} from '../../utils'

export const authRouter = Router()

authRouter
	.route('/login')
	.post(
		middlewareWrapper(loginSchemaValidator),
		middlewareWrapper(loginCredentialsValidator),
		middlewareWrapper(authController.login)
	)

authRouter
	.route('/refresh')
	.post(
		middlewareWrapper(refreshGuard),
		middlewareWrapper(authController.refresh)
	)
