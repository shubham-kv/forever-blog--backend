import {describe, expect, test} from 'vitest'
import supertest from 'supertest'

import app from '@/app'
import {User} from '@/shared/modules/user'
import {Post} from '@/shared/modules/post'
import {LoginDto} from '@/modules/auth/dto'
import {SuccessResponse} from '@/shared/types'
import {GetPostsResponse} from '@/modules/posts/types'
import {UNAUTHORIZED_MESSAGE} from '@/shared/constants'

import {testSetup} from './scripts/test-setup'
import {usersData} from './data/users'

testSetup()
const request = supertest(app)

describe('GET /posts', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	test('requires authentication (throws 401)', async () => {
		const res = await request.get('/posts')

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	test('gets the posts of the user', async () => {
		const user = usersData[0]
		const userDocument = await User.findOne({email: user.email})
		const postDocuments = await Post.find({author: userDocument?.id})

		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body.data.token).toBeDefined()

		const expectedResponse: SuccessResponse<GetPostsResponse> = {
			success: true,
			data: {
				posts: postDocuments.map(({id, title, content}) => ({
					id,
					title,
					content
				}))
			}
		}

		const res = await request
			.get('/posts')
			.set('Authorization', `Bearer ${loginRes.body.data.token}`)

		expect(res.status).toBe(200)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(expectedResponse)
	})
})
