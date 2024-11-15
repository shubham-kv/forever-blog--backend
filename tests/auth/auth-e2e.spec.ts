import 'dotenv/config'
import supertest from 'supertest'
import {faker} from '@faker-js/faker'

import app from '../../src/app'

import {LoginDto} from '../../src/modules/auth/dto'
import {LoginControllerResponse} from '../../src/modules/auth/types'
import {CreateUserDto} from '../../src/modules/users/dto'
import {User} from '../../src/modules'
import {SuccessResponse} from '../../src/shared/types'
import {REFRESH_TOKEN_COOKIE} from '../../src/modules/auth/constants'

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
			existingUsers.map(async existingUser => {
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

		const expectedResponse: SuccessResponse<LoginControllerResponse> = {
			success: true,
			data: {
				token: expect.stringMatching(/.*/)
			}
		}

		// assert for successful login
		const res = await request.post('/auth/login').send(loginData)

		expect(res.status).toBe(200)
		expect(res.headers['set-cookie'][0]).toBeDefined()
		expect(res.headers['set-cookie'][0]).toContain(REFRESH_TOKEN_COOKIE)
		expect(res.headers['set-cookie'][0]).toMatch(/httponly/i)
		expect(res.headers['set-cookie'][0]).toMatch(/secure/i)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})
