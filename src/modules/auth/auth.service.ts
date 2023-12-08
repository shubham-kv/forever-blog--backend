import {JwtPayload} from 'jsonwebtoken'

import {tokenConfig} from '../../configs'
import {LoginServiceResponse, RefreshServiceResponse} from './types'

import {signToken} from './utils'

export async function login(userId: string): Promise<LoginServiceResponse> {
	const payload: JwtPayload = {
		sub: userId
	}

	const accessToken = signToken(
		payload,
		tokenConfig.accessTokenSecret,
		tokenConfig.accessTokenExpiresIn
	)

	const refreshToken = signToken(
		payload,
		tokenConfig.refreshTokenSecret,
		tokenConfig.refreshTokenExpiresIn
	)

	return {
		accessToken,
		refreshToken
	}
}

export async function refresh(userId: string): Promise<RefreshServiceResponse> {
	const payload: JwtPayload = {
		sub: userId
	}

	const accessToken = signToken(
		payload,
		tokenConfig.accessTokenSecret,
		tokenConfig.accessTokenExpiresIn
	)

	return {
		accessToken
	}
}
