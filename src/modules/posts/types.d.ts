import {RequestHandler} from 'express'
import {PostEntity} from '../../../shared/modules/post'
import {CreatePostDto, UpdatePostDto} from './dto'

export type CreatePostResponse = {
	post: PostEntity
}

export type GetPostsResponse = {
	posts: PostEntity[]
}

export type ParamsWithId = {
	id: string
}

export type GetPostResponse = {
	post: PostEntity
}

type CreatePostResBody = SuccessResponse<CreatePostResponse>
export type CreatePostHandler = RequestHandler<
	unknown,
	CreatePostResBody,
	CreatePostDto
>

type GetPostsResBody = SuccessResponse<GetPostsResponse>
export type GetPostsHandler = RequestHandler<unknown, GetPostsResBody>

type GetPostResBody = SuccessResponse<GetPostResponse>
export type GetPostHandler = RequestHandler<ParamsWithId, GetPostResBody>

type UpdatePostResBody = SuccessResponse<GetPostResponse>
export type UpdatePostHandler = RequestHandler<
	ParamsWithId,
	UpdatePostResBody,
	UpdatePostDto
>

type DeletePostResBody = SuccessResponse<GetPostResponse>
export type DeletePostHandler = RequestHandler<ParamsWithId, DeletePostResBody>
