import {PostEntity} from '../post'

export class UserEntity {
	id: string
	firstName: string
	lastName: string
	email: string
	password?: string
	posts?: PostEntity[]

	constructor(user: UserEntity) {
		Object.assign(this, user)
	}
}
