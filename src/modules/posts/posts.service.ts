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

	const postDocuments = await Post.find({userId})
	const postDocument = postDocuments.find((post) => post.id === postId)

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

	const postDocument = (await Post.find({userId})).find(
		(post) => post.id === postId
	)

	if (!postDocument) {
		throw new NotFoundError()
	}

	const {title: newTitle, content: newContent} = updatePostData
	let shouldSave = false

	if (newTitle) {
		postDocument.title = newTitle
		shouldSave = true
	}

	if (newContent) {
		postDocument.content = newContent
		shouldSave = true
	}

	if (shouldSave) {
		await postDocument.save()
	}

	const {id, title, content} = postDocument
	const post = {id, title, content}

	return {
		post
	}
}
