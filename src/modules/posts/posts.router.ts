import {Router} from 'express'

import {createPostBodyValidator} from './middlewares'
import {createPost} from './posts.controller'

export const postsRouter = Router()

postsRouter
	.route('/')
	.post(createPostBodyValidator, createPost)
