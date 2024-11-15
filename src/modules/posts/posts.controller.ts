import {Request, Response} from 'express'

import * as PostsService from './posts.service'
import {PostEntity} from './post.entity'
import {CreatePostDto} from './dto'

export async function createPost(req: Request, res: Response) {
	const payload: CreatePostDto = req.body
	const post: PostEntity = await PostsService.createPost(payload)

	return res.status(201).json(post)
}
