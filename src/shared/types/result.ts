export type Result<Data, Error> = {
	success: boolean
	data?: Data
	error?: Error
}

export type ErrorResult = {
	success: false
	error: string
}

export type SuccessResult<T> = {
	success: true
	data: T | any
}
