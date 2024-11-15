import {Request, Response} from 'express'

import * as PostsService from './posts.service'
import {CreatePostDto} from './dto'

import {build500Response, buildSuccessResponse} from '../../utils'

export async function createPost(req: Request, res: Response) {
	const payload: CreatePostDto = req.body
	const userId = req.user!.id

	try {
		const createPostResult = await PostsService.createPost(payload, userId)
		return res.status(201).json(buildSuccessResponse(createPostResult))
	} catch (e) {
		console.error(e)
		return res.status(500).json(build500Response())
	}
}
