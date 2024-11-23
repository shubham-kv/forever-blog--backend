import {describe, expect, test} from 'vitest'

import 'dotenv/config'
import supertest from 'supertest'
import crypto from 'crypto'

import app from '@/app'
import {LoginDto} from '@/modules/auth/dto'
import {AuthResponse} from '@/modules/auth/types'
import {User} from '@/shared/modules/user'
import {SuccessResponse} from '@/shared/types'
import {cookieConfig} from '@/configs'
import {UNAUTHORIZED_MESSAGE} from '@/shared/constants'

import {usersData as existingUsers} from './data/users'
import {testSetup} from './scripts/test-setup'

testSetup()
const request = supertest(app)

describe('POST /auth/refresh', () => {
	const errorResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	test('throws a 401 for a request with no refresh token', async () => {
		const res = await request.post('/auth/refresh')

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	test('throws a 401 for any random string passed as refresh token', async () => {
		const randomString = crypto.randomBytes(8).toString('hex')

		const res = await request
			.post('/auth/refresh')
			.set('Cookie', [`${cookieConfig.refreshCookieName}=${randomString}`])

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	test('throws a 401 for a user which has been removed from the database', async () => {
		const user = existingUsers[existingUsers.length - 1]
		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		// proceed under the assumption that the login API works fine
		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.headers['set-cookie']).toBeDefined()
		expect(loginRes.headers['set-cookie']).toHaveLength(1)
		expect(loginRes.headers['set-cookie'][0]).toBeDefined()

		// remove the user from the database
		await User.deleteOne({email: user.email})

		const refreshCookie = loginRes.headers['set-cookie'][0]

		// make the request
		const res = await request
			.post('/auth/refresh')
			.set('Cookie', [refreshCookie])

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	test('generates & sends a token for a request with valid refresh token', async () => {
		const user = existingUsers[0]
		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const expectedRefreshResponse: SuccessResponse<AuthResponse> = {
			success: true,
			data: {
				token: expect.stringMatching(/.*/)
			}
		}

		// proceed under the assumption that the login API works fine
		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.headers['set-cookie']).toBeDefined()
		expect(loginRes.headers['set-cookie']).toHaveLength(1)
		expect(loginRes.headers['set-cookie'][0]).toBeDefined()

		const refreshCookie = loginRes.headers['set-cookie'][0]

		const res = await request
			.post('/auth/refresh')
			.set('Cookie', [refreshCookie])

		expect(res.status).toBe(200)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(expectedRefreshResponse)
	})
})
