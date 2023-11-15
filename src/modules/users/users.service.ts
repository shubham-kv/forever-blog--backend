import {CreateUserDto} from './dto'
import {UserEntity} from './user.entity'
import {User} from './user.model'

import type {CreateUserResponse} from './types'

export async function createUser(
	data: CreateUserDto
): Promise<CreateUserResponse> {
	const {firstName, lastName, email, password} = data

	const document = new User({
		firstName,
		lastName,
		email,
		password
	})

	await document.save()

	const userEntity = new UserEntity({
		id: document._id.toString(),
		firstName: document.firstName,
		lastName: document.lastName,
		email: document.email
	})

	return {
		user: userEntity
	}
}
