import 'dotenv/config'
import supertest from 'supertest'
import {faker} from '@faker-js/faker'
import crypto from 'crypto'

import app from '../../src/app'

import {LoginDto} from '../../src/modules/auth/dto'
import {AuthControllerResponse} from '../../src/modules/auth/types'
import {CreateUserDto} from '../../src/modules/users/dto'
import {User} from '../../src/shared/modules/user'
import {SuccessResponse} from '../../src/shared/types'

import {
	REFRESH_TOKEN_COOKIE,
	UNAUTHORIZED_MESSAGE
} from '../../src/modules/auth/constants'

import {setup} from '../setup'

import {invalidLoginData} from './data/invalid-login-data'
import {usersData as existingUsers} from '../users/data'

// setup the test environment
setup()

const request = supertest(app)

describe('POST /auth/login', () => {
	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	it('throws 400 for requests with invalid login data', async () => {
		await Promise.all(
			invalidLoginData.map(async (loginData) => {
				const res = await request.post('/auth/login').send(loginData)

				expect(res.status).toBe(400)
				expect(res.headers['content-type']).toMatch(/json/)
				expect(res.body).toStrictEqual(errorResponse)
			})
		)
	})

	it('throws 400 for incorrect credentials', async () => {
		await Promise.all(
			existingUsers.map(async (existingUser) => {
				const loginData: LoginDto = {
					email: existingUser.email,
					password: faker.internet.password()
				}

				const res = await request.post('/auth/login').send(loginData)

				expect(res.status).toBe(400)
				expect(res.headers['content-type']).toMatch(/json/)
				expect(res.body).toStrictEqual(errorResponse)
			})
		)
	})

	it('authenticates the user', async () => {
		const createUserDto: CreateUserDto = {
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password()
		}

		// save the user to the database before
		const userDoc = new User(createUserDto)
		await userDoc.save()

		const loginData: LoginDto = {
			email: createUserDto.email,
			password: createUserDto.password
		}

		const expectedResponse: SuccessResponse<AuthControllerResponse> = {
			success: true,
			data: {
				token: expect.stringMatching(/.*/)
			}
		}

		// assert for successful login
		const res = await request.post('/auth/login').send(loginData)

		expect(res.status).toBe(200)
		expect(res.headers['set-cookie']).toBeDefined()
		expect(res.headers['set-cookie']).toHaveLength(1)
		expect(res.headers['set-cookie'][0]).toBeDefined()
		expect(res.headers['set-cookie'][0]).toContain(REFRESH_TOKEN_COOKIE)
		expect(res.headers['set-cookie'][0]).toMatch(/httponly/i)
		expect(res.headers['set-cookie'][0]).toMatch(/secure/i)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})

describe('POST /auth/refresh', () => {
	const errorResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	it('throws a 401 for a request with no refresh token', async () => {
		const res = await request.post('/auth/refresh')

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	it('throws a 401 for any random string passed as refresh token', async () => {
		const randomString = crypto.randomBytes(8).toString('hex')

		const res = await request
			.post('/auth/refresh')
			.set('Cookie', [`${REFRESH_TOKEN_COOKIE}=${randomString}`])

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	it('throws a 401 for a user which has been removed from the database', async () => {
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

	it('generates & sends a token for a request with valid refresh token', async () => {
		const user = existingUsers[0]
		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const expectedRefreshResponse: SuccessResponse<AuthControllerResponse> = {
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
