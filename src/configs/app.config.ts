type AppConfigType = {
	port: number
	mongoUri: string
	frontendOrigin: string
}

export const appConfig: AppConfigType = {
	port: parseInt(process.env.PORT || '5000'),
	mongoUri: process.env.MONGO_URI as string,
	frontendOrigin: process.env.FRONTEND_ORIGIN as string
}
