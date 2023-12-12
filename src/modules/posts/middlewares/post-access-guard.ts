import {RequestHandler} from 'express'

import {Post} from '../../../shared/modules/post'

import {NotFoundError} from '../../../shared/errors'
import {ParamsWithId} from '../types'

type PostAccessGuard = RequestHandler<ParamsWithId>

export const postAccessGuard: PostAccessGuard = async (req, _res, next) => {
	const postId = req.params.id
	const userId = req.user!.id

	const postDocument = (await Post.find({_id: postId, author: userId}))[0]

	if (!postDocument) {
		throw new NotFoundError()
	}

	next()
}
