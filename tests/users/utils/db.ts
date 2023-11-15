import mongoose from 'mongoose'
require('dotenv').config()

export const initiateDbConnection = async () => {
	// initiate connection to the database
	const mongoUri = process.env.MONGO_URI ?? ''

	if (!mongoUri) {
		throw new Error('Invalid Mongo URI!')
	}

	await mongoose.connect(mongoUri)
}

export const terminateDbConnection = async () => {
	// terminate the connection
	await mongoose.connection.close()
}
