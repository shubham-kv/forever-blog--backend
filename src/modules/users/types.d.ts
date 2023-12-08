import {RequestHandler} from 'express'

import {UserEntity} from '../../shared/modules/user'
import {CreateUserDto} from './dto'
import {SuccessResponse} from '../../shared/types'

export type CreateUserResponse = {
	user: UserEntity
}

type CreateUserResBody = SuccessResponse<CreateUserResponse>
export type CreateUserHandler = RequestHandler<
	unknown,
	CreateUserResBody,
	CreateUserDto
>
