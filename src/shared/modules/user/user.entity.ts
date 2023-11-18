export class UserEntity {
	id: string
	firstName: string
	lastName: string
	email: string
	password?: string
	posts?: string[]

	constructor(user: UserEntity) {
		Object.assign(this, user)
	}
}
