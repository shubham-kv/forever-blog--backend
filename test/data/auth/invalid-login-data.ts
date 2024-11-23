import {faker} from '@faker-js/faker'
import {LoginDto} from '@/modules/auth/dto'

type InvalidLoginData = Partial<Record<keyof LoginDto, unknown>>

export const invalidLoginData: InvalidLoginData[] = [
	{},

	{
		email: 1
	},
	{
		email: true
	},
	{
		email: false
	},
	{
		email: ''
	},
	{
		email: '  '
	},
	{
		email: 'john'
	},
	{
		email: 'john.doe'
	},
	{
		email: 'john.doe@email'
	},
	{
		email: 'john.doe@email.foobar'
	},

	{
		email: faker.internet.email()
	},
	{
		email: faker.internet.email(),
		password: 1
	},
	{
		email: faker.internet.email(),
		password: true
	},
	{
		email: faker.internet.email(),
		password: false
	},
	{
		email: faker.internet.email(),
		password: ''
	},
	{
		email: faker.internet.email(),
		password: '1234567'
	},
	{
		email: faker.internet.email(),
		password: 'aaaaaaa'
	},
	{
		email: faker.internet.email(),
		password: '12345678901234567'
	},
	{
		email: faker.internet.email(),
		password: 'fffffffffffffffff'
	}
]
