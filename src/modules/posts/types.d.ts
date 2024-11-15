import {RequestHandler} from 'express'
import {PostEntity} from '../../../shared/modules/post'
import {CreatePostDto, UpdatePostDto} from './dto'

export type Post = Pick<PostEntity, 'id' | 'title' | 'content'>

export type CreatePostResponse = {
	post: Post
}

export type GetPostsResponse = {
	posts: Post[]
}

export type ParamsWithId = {
	id: string
}

export type GetPostResponse = {
	post: Post
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
