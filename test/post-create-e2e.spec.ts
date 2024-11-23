import {beforeAll, describe, expect, test} from 'vitest'
import crypto from 'crypto'
import supertest, { Response } from 'supertest'

import app from '@/app'
import {LoginDto} from '@/modules/auth/dto'
import {CreatePostDto} from '@/modules/posts/dto'
import {SuccessResponse} from '@/shared/types'
import {CreatePostResponse} from '@/modules/posts/types'
import {UNAUTHORIZED_MESSAGE} from '@/shared/constants'

import {testSetup} from './scripts/test-setup'
import {usersData} from './data/users'
import {invalidCreatePostData} from './data/posts'

testSetup()
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

	test('requires authentication (throws 401)', async () => {
		const res = await request.post('/posts')

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	test('throws a 401 for invalid token', async () => {
		const randomString = crypto.randomBytes(16).toString('hex')

		const res = await request
			.post('/posts')
			.set('Authorization', `Bearer ${randomString}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	// test('throws a 400 for invalid request body data', async () => {
	// 	const user = usersData[0]
	// 	const loginDto: LoginDto = {
	// 		email: user.email,
	// 		password: user.password
	// 	}

	// 	const loginRes = await request.post('/auth/login').send(loginDto)
	// 	expect(loginRes.status).toBe(200)
	// 	expect(loginRes.body.data.token).toBeDefined()

	// 	await Promise.all(
	// 		invalidCreatePostDataValues.map(async (createPostData) => {
	// 			const res = await request
	// 				.post('/posts')
	// 				.set('Authorization', `Bearer ${loginRes.body.data.token}`)
	// 				.send(createPostData)

	// 			expect(res.status).toBe(400)
	// 			expect(res.headers['content-type']).toMatch(/json/)
	// 			expect(res.body).toStrictEqual(errorResponse)
	// 		})
	// 	)
	// })

	describe('when called with invalid data', () => {
		const responses: Response[] = []

		beforeAll(async () => {
			const loginDto: LoginDto = {
				email: usersData[0].email,
				password: usersData[0].password
			}
			const loginResponse = await request.post('/auth/login').send(loginDto)

			if (!loginResponse?.body?.data?.token) {
				throw new Error('Login Failed')
			}

			for (const createPostData of invalidCreatePostData) {
				const createPostResponse = await request
					.post('/posts')
					.set('Authorization', `Bearer ${loginResponse.body.data.token}`)
					.send(createPostData)
				responses.push(createPostResponse)
			}
		})

		test('throws a 400', () => {
			for (const res of responses) {
				expect(res.status).toBe(400)
				expect(res.headers['content-type']).toMatch(/json/)
				expect(res.body).toMatchObject(errorResponse)
			}
		})
	})

	test('creates a new post and returns it', async () => {
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
