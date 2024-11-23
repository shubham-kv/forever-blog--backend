import {describe, beforeAll, expect, test} from 'vitest'

import 'dotenv/config'
import supertest, {Response} from 'supertest'
import bcrypt from 'bcryptjs'
import {faker} from '@faker-js/faker'

import app from '@/app'
import {CreateUserDto} from '@/modules/users/dto'
import {User, UserEntity} from '@/shared/modules/user'
import type {SuccessResponse} from '@/shared/types'
import type {CreateUserResponse} from '@/modules/users/types'

import {invalidCreateUserData} from './data/users'
import {testSetup} from './scripts/test-setup'

testSetup()
const request = supertest(app)

describe('POST /users', () => {
	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	describe('when called with invalid data', () => {
		const responses: Response[] = []

		beforeAll(async () => {
			for (const data of invalidCreateUserData) {
				const res = await request.post('/users').send(data)
				responses.push(res)
			}
		})

		test('throws a 400', () => {
			for (const res of responses) {
				expect(res.status).toBe(400)
				expect(res.body).toMatchObject(errorResponse)
			}
		})
	})

	test('throws a 400 for an existing user', async () => {
		const createUserDto: CreateUserDto = {
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password()
		}

		// save the user to the database before
		const userDoc = new User(createUserDto)
		await userDoc.save()

		// assert by calling the API
		const res = await request.post('/users').send(createUserDto)

		expect(res.status).toBe(400)
		expect(res.body).toStrictEqual(errorResponse)
	})

	test('adds a new non-existing user to the database', async () => {
		const user: CreateUserDto = {
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password()
		}

		const expectedUserData: UserEntity = {
			id: expect.stringMatching(/[0-9A-Fa-f]/g),
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}

		await request.post('/users').send(user)

		const userDocument = await User.findOne({email: user.email})

		expect(userDocument).toBeDefined()
		expect(userDocument).toMatchObject<UserEntity>(expectedUserData)

		const isPasswordValid = await bcrypt.compare(
			user.password,
			userDocument?.password ?? ''
		)
		expect(isPasswordValid).toBe(true)
	})

	test('responds with the created user', async () => {
		const user: CreateUserDto = {
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			email: faker.internet.email(),
			password: faker.internet.password()
		}

		const expectedUserData: UserEntity = {
			id: expect.stringMatching(/[0-9A-Fa-f]/g),
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}

		const expectedResponse: SuccessResponse<CreateUserResponse> = {
			success: true,
			data: {
				user: expectedUserData
			}
		}

		const res = await request.post('/users').send(user)

		expect(res.status).toBe(201)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})
