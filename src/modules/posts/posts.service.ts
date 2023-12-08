import {Post} from '../../shared/modules/post'

import {CreatePostDto} from './dto'

import {InternalServerError} from '../../shared/errors'
import {CreatePostResponse, GetPostsResponse} from './types'

export async function createPost(
	createPostDto: CreatePostDto,
	userId: string
): Promise<CreatePostResponse> {
	const postDocument = new Post({
		...createPostDto,
		userId
	})
	await postDocument.save()

	const {id, title, content} = postDocument

	return {
		post: {
			id,
			title,
			content
		}
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
