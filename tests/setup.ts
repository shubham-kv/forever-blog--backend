import 'dotenv/config'
import mongoose from 'mongoose'

import {User} from '../src/modules'
import {usersData} from './users/data'

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
	await User.create(usersData)
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
