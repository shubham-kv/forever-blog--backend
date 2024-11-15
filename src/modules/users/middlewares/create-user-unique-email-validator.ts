import type {NextFunction, Request, Response} from 'express'

import {User} from '../user.model'
import {build500Response, buildErrorResponse} from '../../../utils'

export async function createUserUniqueEmailValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const email = req.body.email ?? ''

	try {
		const user = await User.findOne({email})

		if (user) {
			return res
				.status(400)
				.json(buildErrorResponse('Duplicate value for email'))
		}

		next()
	} catch (e) {
		return res.status(500).json(build500Response())
	}
}
