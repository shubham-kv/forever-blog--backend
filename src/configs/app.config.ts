type AppConfigType = {
	port: number
	mongoUri: string
}

export const appConfig: AppConfigType = {
	port: parseInt(process.env.PORT!),
	mongoUri: process.env.MONGO_URI!
}
