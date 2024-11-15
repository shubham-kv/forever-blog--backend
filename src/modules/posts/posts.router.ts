import {Router} from 'express'

import * as postsController from './posts.controller'
import {authGuard} from '../../shared/middlewares'

import {
	createPostBodyValidator,
	paramWithIdValidator,
	updatePostBodyValidator
} from './middlewares'

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
		requestWrapper(paramWithIdValidator),
		requestWrapper(postsController.getPost as never)
	)
	.patch(
		requestWrapper(authGuard),
		requestWrapper(paramWithIdValidator),
		requestWrapper(updatePostBodyValidator),
		requestWrapper(postsController.updatePost as never)
	)
