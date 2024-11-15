import app from './app'
import {appConfig} from './configs'

import {logger} from './modules/logger'
import {connectToMongodb} from './loaders'

async function bootstrap() {
	const {port} = appConfig
	await connectToMongodb()

	app.listen(port, () => {
		logger.info(`Server running at http://localhost:${port}/\n`)
	})
}

bootstrap()
