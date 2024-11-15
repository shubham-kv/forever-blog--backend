import jwt from 'jsonwebtoken'

import {tokenConfig} from '../../configs'
import {LoginServiceResponse} from './types'

import {SERVER_ERROR_MESSAGE} from '../../shared/constants'

export async function login(user: {id: string}): Promise<LoginServiceResponse> {
	const userId = user?.id

	if (!userId) {
		throw new Error(SERVER_ERROR_MESSAGE)
	}

	const payload = {
		id: userId
	}

	const {
		accessTokenSecret,
		accessTokenExpiresIn,
		refreshTokenSecret,
		refreshTokenExpiresIn
	} = tokenConfig

	const accessToken = jwt.sign(payload, accessTokenSecret, {
		expiresIn: accessTokenExpiresIn
	})

	const refreshToken = jwt.sign(payload, refreshTokenSecret, {
		expiresIn: refreshTokenExpiresIn
	})

	return {
		accessToken,
		refreshToken
	}
}
