import {PostEntity} from '../post.entity'

export type CreatePostResponse = {
	post: Pick<PostEntity, 'id' | 'title' | 'content'>
}
