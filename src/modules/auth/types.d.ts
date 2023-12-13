import {RequestHandler} from 'express'

import {LoginDto} from './dto'
import {SuccessResponse} from '../../shared/types'
import {UserEntity} from '../../shared/modules/user'

export type AuthResponse = {
	token: string
}

export type LoginResponse = {
	token: string
	user: UserEntity
}

export type LoginServiceResponse = {
	accessToken: string
	refreshToken: string
}

export type RefreshServiceResponse = {
	accessToken: string
}

type LoginResBody = SuccessResponse<LoginResponse>
export type LoginHandler = RequestHandler<unknown, LoginResBody, LoginDto>

type RefreshResBody = SuccessResponse<AuthResponse>
export type RefreshHandler = RequestHandler<unknown, RefreshResBody>
