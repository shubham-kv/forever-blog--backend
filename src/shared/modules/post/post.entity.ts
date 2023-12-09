import {UserEntity} from '../user'

export class PostEntity {
	id: string
	title: string
	content: string
	author?: UserEntity

	constructor(post: PostEntity) {
		Object.assign(this, post)
	}
}
