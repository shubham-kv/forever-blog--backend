import 'dotenv/config'
import mongoose from 'mongoose'

import {User} from '../src/shared/modules/user'
import {Post} from '../src/shared/modules/post'

import {usersData} from './users/data'
import {postsData} from './posts/data'

export const initiateDbConnection = async () => {
	const mongoUri = process.env.MONGO_URI

	if (!mongoUri) {
		throw new Error('Invalid Mongo URI!')
	}

	await mongoose.connect(mongoUri)
}

export const terminateDbConnection = async () => {
	await mongoose.connection.close()
}

export async function seedDatabase() {
	const users = await User.create(usersData)
	const posts = postsData.map((post) => ({...post, author: users[0].id}))
	await Post.create(posts)
}

export async function clearDatabase() {
	const collections = Object.values(mongoose.connection.collections)

	await Promise.all(
		collections.map(async (collection) => {
			await collection.deleteMany()
		})
	)
}

export function setup() {
	beforeAll(initiateDbConnection)

	beforeEach(seedDatabase)
	afterEach(clearDatabase)

	afterAll(terminateDbConnection)
}
