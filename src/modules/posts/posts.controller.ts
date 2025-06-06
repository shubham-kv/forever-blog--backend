import * as postsService from './posts.service'

import {buildSuccessResponse} from '../../utils'
import {
	CreatePostHandler,
	GetPostsHandler,
	GetPostHandler,
	UpdatePostHandler,
	DeletePostHandler
} from './types'

export const createPost: CreatePostHandler = async (req, res) => {
	const authorId = req.user!.id
	const createPostResult = await postsService.createPost(req.body, authorId)

	res.status(201).json(buildSuccessResponse(createPostResult))
}

export const getPosts: GetPostsHandler = async (req, res) => {
	const authorId = req.user!.id
	const getPostsResult = await postsService.getPosts(authorId)

	res.status(200).json(buildSuccessResponse(getPostsResult))
}

export const getPost: GetPostHandler = async (req, res) => {
	const postId = req.params.id
	const getPostResult = await postsService.getPost(postId)

	res.status(200).json(buildSuccessResponse(getPostResult))
}

export const updatePost: UpdatePostHandler = async (req, res) => {
	const postId = req.params.id
	const updatePostResult = await postsService.updatePost(postId, req.body)

	res.status(200).json(buildSuccessResponse(updatePostResult))
}

export const deletePost: DeletePostHandler = async (req, res) => {
	const postId = req.params.id
	const deletePostResult = await postsService.deletePost(postId)

	res.status(200).json(buildSuccessResponse(deletePostResult))
}
