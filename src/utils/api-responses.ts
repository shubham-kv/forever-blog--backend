import {SERVER_ERROR_MESSAGE} from '../shared/constants'
import {ErrorResponse, SuccessResponse} from '../shared/types'

export const buildSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
	success: true,
	data: data
})

export const buildErrorResponse = (error: string): ErrorResponse => ({
	success: false,
	error: error
})

export const build500Response = (): ErrorResponse => ({
	success: false,
	error: SERVER_ERROR_MESSAGE
})
