import mongoose from 'mongoose'
import {appConfig} from '../configs'

const handleInitialConnectionError = (e: any) => {
	console.error(`Failed to setup a connection to mongo!`)
	console.error(e)
}

const onConnectionOpen = () => {
	console.log(`MongoDB connection is now open!`)
}

const onConnectionError = () => {
	console.log(`Some MongoDB connection error!`)
}

const onDisconnection = () => {
	console.log(`MongoDB Disconnected`)
}

export const connectToMongo = async () => {
	const {mongoUri} = appConfig

	try {
		await mongoose.connect(mongoUri)

		mongoose.connection.once('open', onConnectionOpen)
		mongoose.connection.on('error', onConnectionError)
		mongoose.connection.on('disconnected', onDisconnection)
	}
	catch(e: any) {
		handleInitialConnectionError(e)
	}
}
