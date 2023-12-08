import {Router} from 'express'

import {authGuard} from '../../shared/middlewares'
import {createPostBodyValidator} from './middlewares'
import {createPost} from './posts.controller'

export const postsRouter = Router()

// prettier-ignore
postsRouter
	.route('/')
	.post(authGuard, createPostBodyValidator, createPost)
