import {Request, Response} from 'express'

import * as PostsService from './posts.service'
import {CreatePostDto} from './dto'

import {Result} from '../../shared/types'

export async function createPost(req: Request, res: Response) {
	const payload: CreatePostDto = req.body

	let status = 500
	let result: Result<any, any> = {
		success: false
	}

	try {
		result = await PostsService.createPost(payload)

		if (result.success) {
			status = 201
		} else {
			status = 400
		}
	} catch (e: any) {
		result.success = false
		result.error = e.message
		console.log(e)
	} finally {
		return res.status(status).json(result)
	}
}
