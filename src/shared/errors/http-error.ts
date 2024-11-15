export class HttpError extends Error {
	status: number
	data: object | undefined

	constructor(status: number, message: string = '', data?: object) {
		super(message)
		this.status = status
		this.data = data
	}
}
