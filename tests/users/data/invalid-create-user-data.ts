import type {CreateUserDto} from '../../../src/modules/users/dto'

type InvalidCreateUserData = Partial<Record<keyof CreateUserDto, any>>

export const invalidCreateUserData: InvalidCreateUserData[] = [
	{},

	{
		firstName: 1
	},
	{
		firstName: true
	},
	{
		firstName: ''
	},
	{
		firstName: '     '
	},

	{
		firstName: 'John'
	},
	{
		firstName: 'John',
		lastName: 1
	},
	{
		firstName: 'John',
		lastName: false
	},
	{
		firstName: 'John',
		lastName: ''
	},
	{
		firstName: 'John',
		lastName: '     '
	},

	{
		firstName: 'John',
		lastName: 'Doe'
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: true
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: ''
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: '     '
	},

	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@email.com'
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@email.com',
		password: 1
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@email.com',
		password: true
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@email.com',
		password: ''
	},
	{
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@email.com',
		password: '   '
	}
]
