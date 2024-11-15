import {Post, PostEntity} from '../../shared/modules/post'

import {CreatePostDto, UpdatePostDto} from './dto'
import {CreatePostResponse, GetPostResponse, GetPostsResponse} from './types'

export async function createPost(
	createPostDto: CreatePostDto,
	authorId: string
): Promise<CreatePostResponse> {
	const postDocument = new Post({
		...createPostDto,
		author: authorId
	})
	await postDocument.save()

	const {id, title, content} = postDocument
	const post = new PostEntity({id, title, content})

	return {
		post
	}
}

export async function getPosts(authorId: string): Promise<GetPostsResponse> {
	const rawPosts = await Post.find({author: authorId})
	const posts = rawPosts.map(
		({id, title, content}) => new PostEntity({id, title, content})
	)

	return {
		posts
	}
}

export async function getPost(postId: string): Promise<GetPostResponse> {
	const postDocument = await Post.findById(postId).populate('author')

	const {id, title, content} = postDocument!
	const post = new PostEntity({
		id,
		title,
		content
	})

	return {
		post
	}
}

export async function updatePost(
	postId: string,
	updatePostData: UpdatePostDto
): Promise<GetPostResponse> {
	const {title: newTitle, content: newContent} = updatePostData

	const postDocument = await Post.findByIdAndUpdate(
		postId,
		{
			$set: {
				...(newTitle ? {title: newTitle} : {}),
				...(newContent ? {content: newContent} : {})
			}
		},
		{new: true}
	)

	const {id, title, content} = postDocument!
	const post = new PostEntity({id, title, content})

	return {
		post
	}
}

export async function deletePost(postId: string): Promise<GetPostResponse> {
	const postDocument = await Post.findByIdAndDelete(postId)

	const {id, title, content} = postDocument!
	const post = {id, title, content}

	return {
		post
	}
}
