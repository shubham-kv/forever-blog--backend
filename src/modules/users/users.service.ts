import {CreateUserDto} from './dto'
import {UserEntity} from './user.entity'
import {User} from './user.model'

import type {Result} from '../../shared/types'

type SuccessResult = Result<{user: UserEntity}, undefined>
type ErrorResult = Result<undefined, string>

export async function createUser(
	data: CreateUserDto
): Promise<SuccessResult | ErrorResult> {
	const {firstName, lastName, email, password} = data

	const userDocument = new User({
		firstName,
		lastName,
		email,
		password
	})

	try {
		await userDocument.save()
	} catch (e: any) {
		const result: ErrorResult = {
			success: false,
			error: e.message()
		}
		return result
	}

	const user = new UserEntity({
		id: userDocument._id.toString(),
		firstName,
		lastName,
		email
	})

	const result: SuccessResult = {
		success: true,
		data: {
			user
		}
	}

	return result
}
