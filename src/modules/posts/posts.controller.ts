import {Request} from 'express'

import * as postsService from './posts.service'
import {CreatePostDto} from './dto'

import {buildSuccessResponse} from '../../utils'
import {CreatePostHandler, GetPostsHandler, GetPostHandler} from './types'

export const createPost: CreatePostHandler = async (req, res) => {
	const payload: CreatePostDto = req.body
	const userId = (req as Request).user!.id
	const createPostResult = await postsService.createPost(payload, userId)

	res.status(201).json(buildSuccessResponse(createPostResult))
}

export const getPosts: GetPostsHandler = async (req, res) => {
	const userId = (req as Request).user!.id
	const getPostsResult = await postsService.getPosts(userId)

	res.status(200).json(buildSuccessResponse(getPostsResult))
}

export const getPost: GetPostHandler = async (req, res) => {
	const postId = req.params.id
	const userId = (req as Request).user!.id
	const getPostResult = await postsService.getPost(userId, postId)

	res.status(200).json(buildSuccessResponse(getPostResult))
}
