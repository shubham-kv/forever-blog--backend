import type {Request, Response} from 'express'

import * as UsersService from './users.service'
import {CreateUserDto} from './dto'

import {buildSuccessResponse, build500Response} from '../../utils'

export async function createUser(req: Request, res: Response) {
	const createUserDto: CreateUserDto = req.body as CreateUserDto

	try {
		const createUserResponse = await UsersService.createUser(createUserDto)
		return res.status(201).json(buildSuccessResponse(createUserResponse))
	} catch (e) {
		console.error(e)
		return res.status(500).json(build500Response())
	}
}
