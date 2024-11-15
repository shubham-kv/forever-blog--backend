import mongoose from 'mongoose'
import supertest from 'supertest'
import {faker} from '@faker-js/faker'

import app from '../src/app'

import {CreateUserDto} from '../src/modules/users/dto'
import {UserEntity} from '../src/modules/users/user.entity'
import {User} from '../src/modules/users/user.model'
import type {SuccessResponse} from '../src/shared/types'
import type {CreateUserResponse} from '../src/modules/users/types'

require('dotenv').config()

beforeEach(async () => {
	// initiate connection to the database
	const mongoUri = process.env.MONGO_URI ?? ''

	if (!mongoUri) {
		throw new Error('Invalid Mongo URI!')
	}

	await mongoose.connect(mongoUri)
})

const request = supertest(app)

describe(`POST /users`, () => {
	it(`should create a new user`, async () => {
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

		// also make sure that the user exists in the database
		const userDocument = await User.findOne({email: user.email})

		expect(userDocument).toBeDefined()
		expect(userDocument).toMatchObject<UserEntity>(expectedUserData)
	})
})

afterEach(async () => {
	// disconnect with the database
	await mongoose.connection.close()
})
