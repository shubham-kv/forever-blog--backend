import {describe, expect, test} from 'vitest'
import supertest from 'supertest'
import app from '@/app'

const request = supertest(app)

describe('GET /hello', () => {
	test("should return 'hello world'", async () => {
		const res = await request.get('/hello')

		expect(res.status).toBe(200)
		expect(res.body.message).toMatch(/hello world/)
		expect(res.headers['content-type']).toMatch(/json/)
	})
})
