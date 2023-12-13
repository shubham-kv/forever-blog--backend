import mongoose from 'mongoose'

import {appConfig} from '../configs'
import {logger} from '../modules'

const handleInitialConnectionError = (e: unknown) => {
	logger.error('Failed to setup a connection to mongo!')
	logger.error(e)
}

const onConnectionOpen = () => {
	logger.info('MongoDB connection is now open!')
}

const onConnectionError = () => {
	logger.info('Some MongoDB connection error!')
}

const onDisconnection = () => {
	logger.info('MongoDB Disconnected')
}

export const connectToMongo = () => {
	const {mongoUri} = appConfig

	mongoose
		.connect(mongoUri)
		.then(() => logger.info('Mongodb Connected!'))
		.catch((e) => handleInitialConnectionError(e))

	mongoose.connection.once('open', onConnectionOpen)
	mongoose.connection.on('error', onConnectionError)
	mongoose.connection.on('disconnected', onDisconnection)
}
