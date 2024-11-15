import {Post} from './post.model'
import {PostEntity} from './post.entity'

import {CreatePostDto} from './dto'

export async function createPost(data: CreatePostDto): Promise<PostEntity> {
	const post = new Post(data)
	await post.save()

	return new PostEntity({
		id: post.id,
		title: post.title,
		content: post.content
	})
}
