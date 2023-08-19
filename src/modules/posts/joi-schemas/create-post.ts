import {
	BaseJoiStringSchema,
	buildJoiObjectSchema
} from '../../../shared/joi-schemas'

const title = BaseJoiStringSchema.trim().required().max(256)
const content = BaseJoiStringSchema.trim().required()

const createPostSchema = {
	title,
	content
}

export const CreatePostSchema = buildJoiObjectSchema(createPostSchema)
