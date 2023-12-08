import {Request, RequestHandler} from 'express'

import * as postsService from './posts.service'
import {CreatePostDto} from './dto'

import {buildSuccessResponse} from '../../utils'

import {SuccessResponse} from '../../shared/types'
import {CreatePostResponse, GetPostsResponse} from './types'

type CreatePostResBody = SuccessResponse<CreatePostResponse>
type CreatePostHandler = RequestHandler<unknown, CreatePostResBody>

type GetPostsResBody = SuccessResponse<GetPostsResponse>
type GetPostsHandler = RequestHandler<unknown, GetPostsResBody>

export const createPost: CreatePostHandler = async (req, res) => {
	const payload: CreatePostDto = req.body
	const userId = (req as Request).user!.id
	const createPostResult = await postsService.createPost(payload, userId)

	res.status(201).json(buildSuccessResponse(createPostResult))
}

export const getPosts: GetPostsHandler = async (req, res) => {
	const userId = (req as Request).user!.id
	const createPostResult = await postsService.getPosts(userId)

	res.status(200).json(buildSuccessResponse(createPostResult))
}
