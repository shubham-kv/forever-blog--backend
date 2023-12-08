import {Router} from 'express'

import {authGuard} from '../../shared/middlewares'
import {createPostBodyValidator, getPostParamValidator} from './middlewares'
import * as postsController from './posts.controller'

import {requestWrapper} from '../../utils'

export const postsRouter = Router()

postsRouter
	.route('/')
	.post(
		requestWrapper(authGuard),
		requestWrapper(createPostBodyValidator),
		requestWrapper(postsController.createPost)
	)
	.get(requestWrapper(authGuard), requestWrapper(postsController.getPosts))

postsRouter
	.route('/:id')
	.get(
		requestWrapper(authGuard),
		requestWrapper(getPostParamValidator),
		requestWrapper(postsController.getPost as never)
	)
