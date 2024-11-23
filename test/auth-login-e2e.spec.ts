import {describe, beforeAll, expect, test} from 'vitest'

import 'dotenv/config'
import supertest, {Response} from 'supertest'
import {faker} from '@faker-js/faker'

import app from '@/app'
import {LoginDto} from '@/modules/auth/dto'
import {LoginResponse} from '@/modules/auth/types'
import {CreateUserDto} from '@/modules/users/dto'
import {User} from '@/shared/modules/user'
import {SuccessResponse} from '@/shared/types'
import {cookieConfig} from '@/configs'

import {invalidLoginData} from './data/auth'
import {usersData as existingUsers} from './data/users'
import {testSetup} from './scripts/test-setup'

// setup the test environment
testSetup()
const request = supertest(app)

describe('POST /auth/login', () => {
	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	describe('when called with invalid data', () => {
		const responses: Response[] = []

		beforeAll(async () => {
			for (const data of invalidLoginData) {
				const res = await request.post('/auth/login').send(data)
				responses.push(res)
			}
		})

		test('throws a 400', () => {
			for (const res of responses) {
				expect(res.status).toBe(400)
				expect(res.headers['content-type']).toMatch(/json/)
				expect(res.body).toStrictEqual({
					...errorResponse,
					key: expect.any(String),
					message: expect.any(String)
				})
			}
		})
	})

	test('throws 400 for incorrect credentials', async () => {
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

	test('authenticates the user', async () => {
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

		const expectedResponse: SuccessResponse<LoginResponse> = {
			success: true,
			data: {
				token: expect.stringMatching(/.*/),
				user: {
					id: expect.stringMatching(/.*/),
					firstName: createUserDto.firstName,
					lastName: createUserDto.lastName,
					email: createUserDto.email
				}
			}
		}

		// assert for successful login
		const res = await request.post('/auth/login').send(loginData)

		expect(res.status).toBe(200)
		expect(res.headers['set-cookie']).toBeDefined()
		expect(res.headers['set-cookie']).toHaveLength(1)
		expect(res.headers['set-cookie'][0]).toBeDefined()
		expect(res.headers['set-cookie'][0]).toContain(
			cookieConfig.refreshCookieName
		)
		expect(res.headers['set-cookie'][0]).toMatch(/httponly/i)
		// expect(res.headers['set-cookie'][0]).toMatch(/secure/i)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})
