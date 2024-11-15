import {JwtPayload} from 'jsonwebtoken'

import {tokenConfig} from '../../configs'
import {LoginServiceResponse, RefreshServiceResponse} from './types'

import {signToken} from './utils'

// prettier-ignore
export async function login(
	userId: string
): Promise<LoginServiceResponse> {
	const payload: JwtPayload = {
		sub: userId
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

// prettier-ignore
export async function refresh(
	userId: string
): Promise<RefreshServiceResponse> {
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
