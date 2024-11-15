import {Post} from './post.model'
import {PostEntity} from './post.entity'

import {CreatePostDto} from './dto'
import {Result} from '../../shared/types'

type CreatePostSuccessResult = {
	post: PostEntity
}
type CreatePostWrappedResult = Result<CreatePostSuccessResult, string>

export async function createPost(
	data: CreatePostDto
): Promise<CreatePostWrappedResult> {
	const rawPost = new Post(data)

	let result: CreatePostWrappedResult = {
		success: false
	}

	try {
		await rawPost.save()

		result.success = true
		result.data = {
			post: new PostEntity({
				id: rawPost.id,
				title: rawPost.title,
				content: rawPost.content
			})
		}
	} catch (e: any) {
		result.success = false
		result.error = e.message
		console.error(e)
	} finally {
		return result
	}
}
