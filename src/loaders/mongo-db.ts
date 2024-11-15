import mongoose from 'mongoose'

import {appConfig} from '../configs'
import {logger} from '../modules'

const handleInitialConnectionError = (e: unknown) => {
	logger.error(`Initial connection to Mongodb threw error '${e}'.`)
	logger.error(e)
}

const onConnectionOpen = () => {
	logger.info(`Received 'open' event, Mongodb connected!!!`)
}

const onConnectionError = (e: unknown) => {
	logger.info(`Received 'error' event from Mongodb, '${e}'.`)
	logger.info(e)
}

const onDisconnection = () => {
	logger.info(`Received 'disconnected' event, Mongodb Disconnected.`)
}

export const connectToMongodb = async () => {
	const {mongoUri} = appConfig

	try {
		await mongoose.connect(mongoUri)
		logger.info(`Yay, Mongodb connected!!!`)
	} catch (e: unknown) {
		handleInitialConnectionError(e)
	}

	mongoose.connection.once('open', onConnectionOpen)
	mongoose.connection.on('error', onConnectionError)
	mongoose.connection.on('disconnected', onDisconnection)
}
