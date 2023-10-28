import {Router} from 'express'

import {createUser} from './users.controller'
import {createUserBodyValidator} from './middlewares'

export const usersRoute = Router()

usersRoute.route('/').post(createUserBodyValidator, createUser)
