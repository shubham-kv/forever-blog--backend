import type {Request, Response} from 'express'

import * as UsersService from './users.service'
import {CreateUserDto} from './dto'

import type {SuccessResult, ErrorResult} from '../../shared/types'

export async function createUser(req: Request, res: Response) {
	const createUserDto: CreateUserDto = req.body as CreateUserDto
	let createUserResult: any

	try {
		createUserResult = await UsersService.createUser(createUserDto)

		if (!createUserResult.success) {
			throw new Error('Internal Server Error')
		}
	} catch (e: any) {
		const result: ErrorResult = {
			success: false,
			error: e.message
		}

		return res.status(500).json(result)
	}

	const result: SuccessResult<any> = {
		success: true,
		data: createUserResult.data
	}

	return res.status(200).json(result)
}
