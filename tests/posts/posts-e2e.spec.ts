import 'dotenv/config'
import crypto from 'crypto'
import supertest from 'supertest'

import app from '../../src/app'
import {LoginDto} from '../../src/modules/auth/dto'
import {AuthControllerResponse} from '../../src/modules/auth/types'
import {SuccessResponse} from '../../src/shared/types'
import {CreatePostDto} from '../../src/modules/posts/dto'
import {CreatePostResponse} from '../../src/modules/posts/types'

import {UNAUTHORIZED_MESSAGE} from '../../src/shared/constants'

import {usersData} from '../users/data'
import {invalidCreatePostDataValues} from './data/invalid-create-post-data'

import {setup} from '../setup'

setup()

const request = supertest(app)

describe('POST /posts', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	it('requires authentication (throws 401)', async () => {
		const res = await request.post('/posts')

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	it('throws a 401 for invalid token', async () => {
		const randomString = crypto.randomBytes(16).toString('hex')

		const res = await request
			.post('/posts')
			.set('Authorization', `Bearer ${randomString}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	it('throws a 400 for invalid request body data', async () => {
		const user = usersData[0]
		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const expectedLoginResponse: SuccessResponse<AuthControllerResponse> = {
			success: true,
			data: {
				token: expect.stringMatching(/.*/)
			}
		}

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body).toStrictEqual(expectedLoginResponse)

		await Promise.all(
			invalidCreatePostDataValues.map(async (createPostData) => {
				const res = await request
					.post('/posts')
					.set('Authorization', `Bearer ${loginRes.body.data.token}`)
					.send(createPostData)

				expect(res.status).toBe(400)
				expect(res.headers['content-type']).toMatch(/json/)
				expect(res.body).toStrictEqual(errorResponse)
			})
		)
	})

	it('creates a new post and returns it', async () => {
		const user = usersData[0]
		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body.data.token).toBeDefined()

		const createPostData: CreatePostDto = {
			title: 'foo',
			content: 'bar'
		}

		const expectedResponse: SuccessResponse<CreatePostResponse> = {
			success: true,
			data: {
				post: {
					id: expect.stringMatching(/.*/),
					...createPostData
				}
			}
		}

		const res = await request
			.post('/posts')
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)
			.send(createPostData)

		expect(res.status).toBe(201)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})
