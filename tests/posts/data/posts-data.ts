import {faker} from '@faker-js/faker'
import {CreatePostDto} from '../../../src/modules/posts/dto'

export const postsData: CreatePostDto[] = new Array(10).fill(0).map(() => ({
	title: faker.person.firstName(),
	content: faker.person.lastName()
}))
