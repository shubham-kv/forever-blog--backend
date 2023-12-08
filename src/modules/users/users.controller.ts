import * as usersService from './users.service'

import {buildSuccessResponse} from '../../utils'
import {CreateUserHandler} from './types'

export const createUser: CreateUserHandler = async (req, res) => {
	const createUserDto = req.body
	const createUserResponse = await usersService.createUser(createUserDto)

	res.status(201).json(buildSuccessResponse(createUserResponse))
}
