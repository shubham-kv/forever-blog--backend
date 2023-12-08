import {BaseStringSchema, buildObjectSchema} from '../../../shared/schemas'

const title = BaseStringSchema.trim().required().max(256)
const content = BaseStringSchema.trim().required()

export const CreatePostSchema = buildObjectSchema({
	title,
	content
})
