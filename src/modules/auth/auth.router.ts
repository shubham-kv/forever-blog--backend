import {Router} from 'express'

import * as AuthController from './auth.controller'
import {
	loginSchemaValidator,
	loginCredentialsValidator,
	refreshGuard
} from './middlewares'

export const authRouter = Router()

// prettier-ignore
authRouter
	.route('/login')
	.post(loginSchemaValidator, loginCredentialsValidator, AuthController.login)

// prettier-ignore
authRouter
	.route('/refresh')
	.post(refreshGuard, AuthController.refresh)
