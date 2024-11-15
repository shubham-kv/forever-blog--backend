import {Post} from './post.model'
import {PostEntity} from './post.entity'

import {CreatePostDto} from './dto'
import {CreatePostResponse} from './types'

export async function createPost(
	data: CreatePostDto
): Promise<CreatePostResponse> {
	const postDocument = new Post(data)
	await postDocument.save()

	const postEntity = new PostEntity({
		id: postDocument.id,
		title: postDocument.title,
		content: postDocument.content
	})

	return {
		post: postEntity
	}
}
