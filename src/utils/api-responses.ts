import {ErrorResponse, SuccessResponse} from '../shared/types'

export const buildSuccessResponse = (
	data: unknown
): SuccessResponse<unknown> => ({
	success: true,
	data: data
})

export const buildErrorResponse = (error: string): ErrorResponse => ({
	success: false,
	error: error
})

export const build500Response = (): ErrorResponse => ({
	success: false,
	error: 'Something went wrong'
})
