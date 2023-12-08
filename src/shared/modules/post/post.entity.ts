export class PostEntity {
	id: string
	title: string
	content: string
	userId: string

	constructor(post: PostEntity) {
		Object.assign(this, post)
	}
}
