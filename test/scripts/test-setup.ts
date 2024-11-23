import {afterAll, afterEach, beforeAll, beforeEach} from 'vitest'

import 'dotenv/config'
import mongoose from 'mongoose'

import {User} from '@/shared/modules/user'
import {Post} from '@/shared/modules/post'

import {usersData} from '../data/users'
import {postsData} from '../data/posts'

export const initiateDbConnection = async () => {
	const mongoUri = process.env.MONGO_URI

	if (!mongoUri) {
		throw new Error('Invalid Mongo URI!')
	}

	await mongoose.connect(mongoUri)
	await seedDatabase()
}

export const terminateDbConnection = async () => {
	await clearDatabase()
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

export function testSetup() {
	beforeAll(initiateDbConnection)

	// beforeEach(seedDatabase)
	// afterEach(clearDatabase)

	afterAll(terminateDbConnection)
}
