import {Router} from 'express'

import * as authController from './auth.controller'
import {
	loginSchemaValidator,
	loginCredentialsValidator,
	refreshGuard
} from './middlewares'

import {requestWrapper} from '../../utils'

export const authRouter = Router()

authRouter
	.route('/login')
	.post(
		requestWrapper(loginSchemaValidator),
		requestWrapper(loginCredentialsValidator),
		requestWrapper(authController.login)
	)

authRouter
	.route('/refresh')
	.post(requestWrapper(refreshGuard), requestWrapper(authController.refresh))
