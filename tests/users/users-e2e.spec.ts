import mongoose from 'mongoose'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import {faker} from '@faker-js/faker'

import app from '../../src/app'

import {CreateUserDto} from '../../src/modules/users/dto'
import {UserEntity} from '../../src/modules/users/user.entity'
import {User} from '../../src/modules/users/user.model'
import type {SuccessResponse} from '../../src/shared/types'
import type {CreateUserResponse} from '../../src/modules/users/types'

import {invalidCreateUserData} from './data/invalid-create-user-data'

require('dotenv').config()

beforeEach(async () => {
	// initiate connection to the database
	const mongoUri = process.env.MONGO_URI ?? ''

	if (!mongoUri) {
		throw new Error('Invalid Mongo URI!')
	}

	await mongoose.connect(mongoUri)
})

afterEach(async () => {
	// disconnect with the database
	await mongoose.connection.close()
})

const request = supertest(app)

describe('POST /users', () => {
	it('throws a 400 when invalid data is passed', async () => {
		await Promise.all(
			invalidCreateUserData.map(async (createUserData) => {
				const res = await request.post('/users').send(createUserData)

				const expectedResponse = {
					success: false,
					error: expect.stringMatching(/.*/)
				}

				expect(res.status).toBe(400)
				expect(res.body).toStrictEqual(expectedResponse)
			})
		)
	})
})

describe(`POST /users`, () => {
	it(`adds a new user to the database`, async () => {
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

	it(`responds with the created user`, async () => {
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
