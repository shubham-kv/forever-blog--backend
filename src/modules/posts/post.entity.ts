export class PostEntity {
	id: string
	title: string
	content: string

	constructor(post: PostEntity) {
		Object.assign(this, post)
	}
}
