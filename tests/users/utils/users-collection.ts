import {User} from '../../../src/modules/users/user.model'
import {usersData} from '../data'

export const seedUsers = async () => {
	try {
		await User.insertMany(usersData)
	} catch (e) {
		throw e
	}
}

export const clearUsers = async () => {
	try {
		await User.deleteMany({})
	} catch (e) {
		throw e
	}
}
