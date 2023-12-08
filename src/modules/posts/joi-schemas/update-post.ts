import {buildObjectSchema} from '../../../shared/schemas'
import {createPostObject} from './create-post'

export const UpdatePostSchema = buildObjectSchema(createPostObject)
	.fork(Object.keys(createPostObject), (schema) => schema.optional())
	.or('title', 'content')
