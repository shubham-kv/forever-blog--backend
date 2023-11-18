import {JwtPayload} from 'jsonwebtoken'

import {tokenConfig} from '../../configs'
import {LoginServiceResponse, RefreshServiceResponse} from './types'

import {signToken} from './utils'

export async function login(user: {id: string}): Promise<LoginServiceResponse> {
	const payload: JwtPayload = {
		sub: user.id
	}

	const {
		accessTokenSecret,
		accessTokenExpiresIn,
		refreshTokenSecret,
		refreshTokenExpiresIn
	} = tokenConfig

	const accessToken = signToken(
		payload,
		accessTokenSecret,
		accessTokenExpiresIn
	)

	const refreshToken = signToken(
		payload,
		refreshTokenSecret,
		refreshTokenExpiresIn
	)

	return {
		accessToken,
		refreshToken
	}
}

export async function refresh(user: {
	id: string
}): Promise<RefreshServiceResponse> {
	const payload: JwtPayload = {
		sub: user.id
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
