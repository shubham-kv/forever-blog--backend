import app from './app'
import {appConfig} from './configs'

import {connectToMongo} from './loaders'

async function bootstrap() {
	const {port} = appConfig

	connectToMongo()

	app.listen(port, () => {
		console.log(`\nServer running at http://localhost:${port}/\n`)
	})
}

bootstrap()
