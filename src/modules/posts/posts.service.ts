import {Post} from '..'
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

	return {
		post: {
			id,
			title,
			content
		}
	}
}
