type AppConfigType = {
	port: number
	mongoUri: string
	frontendOrigin: string
	isProdEnv: boolean
}

export const appConfig: AppConfigType = {
	port: parseInt(process.env.PORT || '4000'),
	mongoUri: process.env.MONGO_URI,
	frontendOrigin: process.env.FRONTEND_ORIGIN,
	isProdEnv: process.env.NODE_ENV === 'production'
}
