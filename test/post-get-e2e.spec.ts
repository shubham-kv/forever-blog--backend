import {describe, expect, test} from 'vitest'
import crypto from 'crypto'
import supertest from 'supertest'

import app from '@/app'
import {User} from '@/shared/modules/user'
import {Post} from '@/shared/modules/post'
import {LoginDto} from '@/modules/auth/dto'
import {SuccessResponse} from '@/shared/types'
import {GetPostResponse} from '@/modules/posts/types'
import {UNAUTHORIZED_MESSAGE} from '@/shared/constants'

import {usersData} from './data/users'
import {testSetup} from './scripts/test-setup'

testSetup()
const request = supertest(app)

describe('GET /posts/:id', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	test('requires authentication (throws 401)', async () => {
		const id = crypto.randomBytes(24).toString('hex')
		const res = await request.get(`/posts/${id}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	test('throws a 404 for non existing entities', async () => {
		const id = crypto.randomBytes(12).toString('hex')
		const user = usersData[0]

		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body.data.token).toBeDefined()

		const res = await request
			.get(`/posts/${id}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)

		expect(res.status).toBe(404)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(errorResponse)
	})

	test('gets the post of the user', async () => {
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

		const expectedResponse: SuccessResponse<GetPostResponse> = {
			success: true,
			data: {
				post: {
					id: postDocument.id,
					title: postDocument.title,
					content: postDocument.content
				}
			}
		}

		const res = await request
			.get(`/posts/${postDocument.id}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)

		expect(res.status).toBe(200)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})
