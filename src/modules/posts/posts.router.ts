import {Router} from 'express'

import * as postsController from './posts.controller'
import {authGuard} from '../../shared/middlewares'

import {
	createPostBodyValidator,
	paramWithIdValidator,
	postAccessGuard,
	updatePostBodyValidator
} from './middlewares'

import {applyMiddlewareWrapper} from '../../utils'

export const postsRouter = Router()

const createPostMiddlewares = applyMiddlewareWrapper(
	authGuard,
	createPostBodyValidator,
	postsController.createPost
)

const getPostsMiddlewares = applyMiddlewareWrapper(
	authGuard,
	postsController.getPosts
)

const getPostMiddlewares = applyMiddlewareWrapper(
	authGuard,
	paramWithIdValidator,
	postAccessGuard as never,
	postsController.getPost as never
)

const updatePostMiddlewares = applyMiddlewareWrapper(
	authGuard,
	paramWithIdValidator,
	postAccessGuard as never,
	updatePostBodyValidator,
	postsController.updatePost as never
)

const deletePostMiddlewares = applyMiddlewareWrapper(
	authGuard,
	paramWithIdValidator,
	postAccessGuard as never,
	postsController.deletePost as never
)

postsRouter
	.route('/')
	.post(...createPostMiddlewares)
	.get(...getPostsMiddlewares)

postsRouter
	.route('/:id')
	.get(...getPostMiddlewares)
	.patch(...updatePostMiddlewares)
	.delete(...deletePostMiddlewares)
