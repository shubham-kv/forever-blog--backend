import {RequestHandler} from 'express'
import {SuccessResponse} from '../../shared/types'

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
export type LoginHandler = RequestHandler<unknown, LoginResBody>

type RefreshResBody = SuccessResponse<AuthResponse>
export type RefreshHandler = RequestHandler<unknown, RefreshResBody>
