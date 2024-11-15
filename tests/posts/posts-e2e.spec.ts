import crypto from 'crypto'
import supertest from 'supertest'
import {faker} from '@faker-js/faker'

import app from '../../src/app'

import {User} from '../../src/shared/modules/user'
import {Post} from '../../src/shared/modules/post'

import {LoginDto} from '../../src/modules/auth/dto'
import {CreatePostDto, UpdatePostDto} from '../../src/modules/posts/dto'

import {SuccessResponse} from '../../src/shared/types'
import {
	CreatePostResponse,
	GetPostResponse,
	GetPostsResponse
} from '../../src/modules/posts/types'

import {UNAUTHORIZED_MESSAGE} from '../../src/shared/constants'

import {usersData} from '../users/data'
import {
	invalidCreatePostDataValues,
	invalidUpdatePostDataValues,
	postsData
} from './data'

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

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body.data.token).toBeDefined()

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

describe('GET /posts', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	it('requires authentication (throws 401)', async () => {
		const res = await request.get('/posts')

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	it('gets the posts of the user', async () => {
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

describe('GET /posts/:id', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	it('requires authentication (throws 401)', async () => {
		const id = crypto.randomBytes(24).toString('hex')
		const res = await request.get(`/posts/${id}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	it('throws a 404 for non existing entities', async () => {
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

	it('gets the post of the user', async () => {
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

describe('PATCH /posts/:id', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	it('throws 401 for unauthorized users', async () => {
		const id = crypto.randomBytes(24).toString('hex')
		const res = await request.patch(`/posts/${id}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	it('throws 400 for invalid post data', async () => {
		const user = usersData[0]
		const userDocument = await User.findOne({email: user.email})
		const postDocuments = await Post.find({author: userDocument?.id})
		const postDocument = postDocuments[0]

		const loginDto: LoginDto = {
			email: user.email,
			password: user.password
		}

		const loginRes = await request.post('/auth/login').send(loginDto)
		expect(loginRes.status).toBe(200)
		expect(loginRes.body.data.token).toBeDefined()

		await Promise.all(
			invalidUpdatePostDataValues.map(async (updatePostData) => {
				const res = await request
					.patch(`/posts/${postDocument.id}`)
					.set('Authorization', `Bearer ${loginRes.body.data.token}`)
					.send(updatePostData)

				expect(res.status).toBe(400)
				expect(res.headers['content-type']).toMatch(/json/)
				expect(res.body).toStrictEqual(errorResponse)
			})
		)
	})

	it('throws 404 for invalid ids & non existing posts', async () => {
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

	it('updates the post with the given id', async () => {
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

describe('DELETE /posts/:id', () => {
	const unauthorizedResponse = {
		success: false,
		error: UNAUTHORIZED_MESSAGE
	}

	const errorResponse = {
		success: false,
		error: expect.stringMatching(/.*/)
	}

	it('throws 401 for unauthorized users', async () => {
		const id = crypto.randomBytes(24).toString('hex')
		const res = await request.delete(`/posts/${id}`)

		expect(res.status).toBe(401)
		expect(res.headers['content-type']).toMatch(/json/)
		expect(res.body).toStrictEqual(unauthorizedResponse)
	})

	it('throws 404 for invalid ids & non existing posts', async () => {
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

	it('deletes the post with the given id', async () => {
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
