import {Router} from 'express'

import * as AuthController from './auth.controller'
import {loginSchemaValidator, loginCredentialsValidator} from './middlewares'

export const authRouter = Router()

authRouter.post(
	'/login',
	loginSchemaValidator,
	loginCredentialsValidator,
	AuthController.login
)
