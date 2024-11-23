import {beforeAll, describe, expect, test} from 'vitest'
import crypto from 'crypto'
import supertest, { Response } from 'supertest'
import {faker} from '@faker-js/faker'

import app from '@/app'
import {User} from '@/shared/modules/user'
import {Post} from '@/shared/modules/post'
import {LoginDto} from '@/modules/auth/dto'
import {UpdatePostDto} from '@/modules/posts/dto'
import {SuccessResponse} from '@/shared/types'
import {GetPostResponse} from '@/modules/posts/types'
import {UNAUTHORIZED_MESSAGE} from '@/shared/constants'

import {testSetup} from './scripts/test-setup'
import {usersData} from './data/users'
import {invalidUpdatePostData} from './data/posts'

testSetup()
const request = supertest(app)

describe('PATCH /posts/:id', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	test('throws 401 for unauthorized users', async () => {
		const id = crypto.randomBytes(24).toString('hex')
		const res = await request.patch(`/posts/${id}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	describe('when called with invalid data', () => {
		const responses: Response[] = []

		beforeAll(async () => {
			const user = usersData[0]
			const loginDto: LoginDto = {email: user.email, password: user.password}
			const loginResponse = await request.post('/auth/login').send(loginDto)
			const token = loginResponse?.body?.data?.token

			if (!token) {
				throw new Error('Login failed!')
			}

			const userDocument = await User.findOne({email: user.email})
			const postDocuments = await Post.find({author: userDocument?.id})
			const postDocument = postDocuments[0]

			for (const updatePostData of invalidUpdatePostData) {
				const updatePostResponse = await request
					.patch(`/posts/${postDocument.id}`)
					.set('Authorization', `Bearer ${token}`)
					.send(updatePostData)

				responses.push(updatePostResponse)
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

	test('throws 404 for invalid ids & non existing posts', async () => {
		const user = usersData[0]

		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body.data.token).toBeDefined()

		const postId = crypto.randomBytes(12).toString('hex')

		const updatePostData: UpdatePostDto = {
			title: faker.lorem.words(),
			content: faker.lorem.paragraphs()
		}

		const res1 = await request
			.patch(`/posts/${postId}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)
			.send(updatePostData)

		expect(res1.status).toBe(404)
		expect(res1.headers['content-type']).toMatch(/json/)
		expect(res1.body).toStrictEqual(errorResponse)

		const postDocument = (await Post.find())[0]
		await postDocument.deleteOne()

		const res2 = await request
			.patch(`/posts/${postDocument.id}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)
			.send(updatePostData)

		expect(res2.status).toBe(404)
		expect(res2.headers['content-type']).toMatch(/json/)
		expect(res2.body).toStrictEqual(errorResponse)
	})

	test('updates the post with the given id', async () => {
		const user = usersData[0]
		const userDocument = await User.findOne({email: user.email})
		const postDocuments = await Post.find({author: userDocument?.id})
		const postDocument = postDocuments[0]

		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		expect(postDocument).toBeDefined()

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body.data.token).toBeDefined()

		const updatePostData: UpdatePostDto = {
			title: faker.lorem.words(),
			content: faker.lorem.paragraphs()
		}

		const expectedResponse: SuccessResponse<GetPostResponse> = {
			success: true,
			data: {
				post: {
					id: postDocument.id,
					title: updatePostData.title,
					content: updatePostData.content
				}
			}
		}

		const res = await request
			.patch(`/posts/${postDocument.id}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)
			.send(updatePostData)

		expect(res.status).toBe(200)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})
