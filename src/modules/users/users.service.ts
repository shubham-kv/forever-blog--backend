import {CreateUserDto} from './dto'
import {UserEntity, User} from '../../shared/modules/user'

import type {CreateUserResponse} from './types'

export async function createUser(
	createUserDto: CreateUserDto
): Promise<CreateUserResponse> {
	const userDocument = new User(createUserDto)
	await userDocument.save()

	const userEntity = new UserEntity({
		id: userDocument.id,
		firstName: userDocument.firstName,
		lastName: userDocument.lastName,
		email: userDocument.email
	})

	return {
		user: userEntity
	}
}
