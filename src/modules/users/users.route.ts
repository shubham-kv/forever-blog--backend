import {Router} from 'express'

import {schemaValidator} from '../../shared/middlewares'
import {createUser} from './users.controller'
import {CreateUserJoiSchema} from './joi-schema'

import type {ErrorResult} from '../../shared/types'

export const usersRoute = Router()

usersRoute.route('/').post(
	(req, res, next) =>
		schemaValidator({
			value: req.body,
			schema: CreateUserJoiSchema,
			onSuccess: next,
			onFailure(error) {
				const result: ErrorResult = {
					success: false,
					error: error
				}
				return res.status(400).json(result)
			}
		}),
	createUser
)
