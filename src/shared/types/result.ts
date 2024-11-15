export type Result<Data, Error> = {
	success: boolean
	data?: Data
	error?: Error
}
