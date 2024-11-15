import express from 'express'
import {postsRouter} from './modules'

const app = express()

app.use(express.json())

app.get('/hello', (_, res) => {
	res.json({
		message: 'hello'
	})
})

app.use('/posts', postsRouter)

export default app
