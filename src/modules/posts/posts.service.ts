import {Post} from '../../shared/modules/post'

import {CreatePostDto, UpdatePostDto} from './dto'

import {InternalServerError, NotFoundError} from '../../shared/errors'
import {CreatePostResponse, GetPostResponse, GetPostsResponse} from './types'

export async function createPost(
	createPostDto: CreatePostDto,
	userId: string
): Promise<CreatePostResponse> {
	if (!userId) {
		throw new InternalServerError()
	}

	const postDocument = new Post({
		...createPostDto,
		userId
	})
	await postDocument.save()

	const {id, title, content} = postDocument
	const post = {id, title, content}

	return {
		post
	}
}

export async function getPosts(userId: string): Promise<GetPostsResponse> {
	if (!userId) {
		throw new InternalServerError()
	}

	const rawPosts = await Post.find({userId})
	const posts = rawPosts.map(({id, title, content}) => ({id, title, content}))

	return {
		posts
	}
}

export async function getPost(
	userId: string,
	postId: string
): Promise<GetPostResponse> {
	if (!userId || !postId) {
		throw new InternalServerError()
	}

	const postDocument = await Post.findOne({_id: postId, userId})

	if (!postDocument) {
		throw new NotFoundError()
	}

	const {id, title, content} = postDocument
	const post = {id, title, content}

	return {
		post
	}
}

export async function updatePost(
	userId: string,
	postId: string,
	updatePostData: UpdatePostDto
): Promise<GetPostResponse> {
	if (!userId || !postId) {
		throw new InternalServerError()
	}

	const {title: newTitle, content: newContent} = updatePostData

	const postDocument = await Post.findOneAndUpdate(
		{_id: postId, userId},
		{
			$set: {
				...(newTitle ? {title: newTitle} : {}),
				...(newContent ? {content: newContent} : {})
			}
		},
		{new: true}
	)

	if (!postDocument) {
		throw new NotFoundError()
	}

	const {id, title, content} = postDocument
	const post = {
		id,
		title,
		content
	}

	return {
		post
	}
}

export async function deletePost(
	userId: string,
	postId: string
): Promise<GetPostResponse> {
	if (!userId || !postId) {
		throw new InternalServerError()
	}

	const postDocument = await Post.findOneAndDelete({_id: postId, userId})

	if (!postDocument) {
		throw new NotFoundError()
	}

	const {id, title, content} = postDocument
	const post = {id, title, content}

	return {
		post
	}
}
