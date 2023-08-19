import {NextFunction, Request, Response} from 'express'
import {CreatePostSchema} from '../joi-schemas'

export const createPostBodyValidator = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const value = req.body
	const schema = CreatePostSchema

	const {error} = schema.validate(value)

	if (error) {
		return res.status(400).send(error.message)
	}

	next()
}
