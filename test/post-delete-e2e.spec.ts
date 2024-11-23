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

import {testSetup} from './scripts/test-setup'
import {usersData} from './data/users'
import {postsData} from './data/posts'

testSetup()
const request = supertest(app)

describe('DELETE /posts/:id', () => {
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
		const res = await request.delete(`/posts/${id}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
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

		const res1 = await request
			.delete(`/posts/${postId}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)

		expect(res1.status).toBe(404)
		expect(res1.headers['content-type']).toMatch(/json/)
		expect(res1.body).toStrictEqual(errorResponse)

		const postDocument = await Post.findOneAndDelete({
			title: postsData[0].title
		})

		const res2 = await request
			.delete(`/posts/${postDocument?.id}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)

		expect(res2.status).toBe(404)
		expect(res2.headers['content-type']).toMatch(/json/)
		expect(res2.body).toStrictEqual(errorResponse)
	})

	test('deletes the post with the given id', async () => {
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
			.delete(`/posts/${postDocument.id}`)
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)

		expect(res.status).toBe(200)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(expectedResponse)

		const postDoc = await Post.findById(postDocument.id)

		expect(postDoc).toBeFalsy()
		expect(postDoc).toBeNull()
	})
})
