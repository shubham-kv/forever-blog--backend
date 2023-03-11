import express from 'express'

const app = express()

app.get('/hello', (_, res) => {
	res.json({
		message: 'hello'
	})
})

export default app
