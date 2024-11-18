import {BaseStringSchema, buildObjectSchema} from '../../../shared/schemas'

const title = BaseStringSchema.trim().max(256)
const content = BaseStringSchema.trim().allow('')

export const createPostObject = {
	title: title.required(),
	content: content.required()
}

export const CreatePostSchema = buildObjectSchema(createPostObject)
