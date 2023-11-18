import supertest from 'supertest'
import app from '../src/app'

const request = supertest(app)

describe('GET /hello', () => {
	it('should return \'hello world\'', async () => {
		const res = await request.get('/hello')

		expect(res.status).toBe(200)
		expect(res.body.message).toMatch(/hello world/)
		expect(res.headers['content-type']).toMatch(/json/)
	})
})
