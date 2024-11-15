import {faker} from '@faker-js/faker'
import {CreateUserDto} from '../../../src/modules/users/dto'

export const usersData: CreateUserDto[] = new Array(5).fill(0).map(() => ({
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	email: faker.internet.email(),
	password: faker.internet.password({
		length: 8
	})
}))
