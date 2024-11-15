import {Post, PostEntity} from '..'
import {User} from '../../shared/modules/user'

import {CreatePostDto} from './dto'
import {CreatePostResponse} from './types'

export async function createPost(
	createPostDto: CreatePostDto,
	userId: string
): Promise<CreatePostResponse> {
	const postDocument = new Post({
		...createPostDto,
		userId
	})
	await postDocument.save()

	const userDocument = await User.findById(userId)
	userDocument?.posts.push(postDocument._id)

	await userDocument?.save()

	const {id, title, content} = postDocument
	const postEntity = new PostEntity({
		id,
		title,
		content,
		userId
	})

	return {
		post: postEntity
	}
}
