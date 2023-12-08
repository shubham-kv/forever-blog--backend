import {RequestHandler} from 'express'
import {PostEntity} from '../../../shared/modules/post'

export type Post = Pick<PostEntity, 'id' | 'title' | 'content'>

export type CreatePostResponse = {
	post: Post
}

export type GetPostsResponse = {
	posts: Post[]
}

export type GetPostParams = {
	id: string
}

export type GetPostResponse = {
	post: Post
}

type CreatePostResBody = SuccessResponse<CreatePostResponse>
export type CreatePostHandler = RequestHandler<unknown, CreatePostResBody>

type GetPostsResBody = SuccessResponse<GetPostsResponse>
export type GetPostsHandler = RequestHandler<unknown, GetPostsResBody>

type GetPostResBody = SuccessResponse<GetPostResponse>
export type GetPostHandler = RequestHandler<GetPostParams, GetPostResBody>
