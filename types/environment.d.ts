export {}

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV?: string | undefined

			PORT: string
			MONGO_URI: string
			TEST_MONGO_URI: string
			FRONTEND_ORIGIN: string
			REFRESH_COOKIE_NAME: string

			ACCESS_TOKEN_SECRET: string
			ACCESS_TOKEN_EXPIRES_IN: string
			REFRESH_TOKEN_SECRET: string
			REFRESH_TOKEN_EXPIRES_IN: string
		}
	}
}
