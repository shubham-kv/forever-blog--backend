import {RequestHandler} from 'express'
import {SuccessResponse} from '../../shared/types'
import {LoginDto} from './dto'

export type AuthResponse = {
	token: string
}

export type LoginServiceResponse = {
	accessToken: string
	refreshToken: string
}

export type RefreshServiceResponse = {
	accessToken: string
}

type LoginResBody = SuccessResponse<AuthResponse>
export type LoginHandler = RequestHandler<unknown, LoginResBody, LoginDto>

type RefreshResBody = SuccessResponse<AuthResponse>
export type RefreshHandler = RequestHandler<unknown, RefreshResBody>
