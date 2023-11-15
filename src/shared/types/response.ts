export type Result<Data, Error> = {
	success: boolean
	data?: Data
	error?: Error
}

export type ErrorResponse = {
	success: boolean
	error: string
}

export type SuccessResponse<T = unknown> = {
	success: boolean
	data: T
}
