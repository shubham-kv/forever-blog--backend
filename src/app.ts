import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'

import {authRouter, postsRouter, usersRouter} from './modules'

const app = express()

app.use(helmet())
app.use(compression())
app.use(
	rateLimit({
		max: 50,
		windowMs: 1000,
		standardHeaders: true,
		legacyHeaders: false
	})
)

app.use(cookieParser())
app.use(express.json())

app.disable('x-powered-by')

app.get('/hello', (_, res) => {
	res.json({
		message: 'hello world'
	})
})

app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

export default app
