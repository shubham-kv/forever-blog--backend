import {User} from '../../../shared/modules/user'
import {BadRequestError} from '../../../shared/errors'
import {CreateUserHandler} from '../types'

export const createUserUniqueEmailValidator: CreateUserHandler = async (
	req,
	_res,
	next
) => {
	const email = req.body.email
	const user = await User.findOne({email})

	if (user) {
		throw new BadRequestError('Duplicate value for email')
	}

	next()
}
