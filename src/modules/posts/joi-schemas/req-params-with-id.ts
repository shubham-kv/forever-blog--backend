import {BaseStringSchema, buildObjectSchema} from '../../../shared/schemas'

export const ReqParamsWithIdSchema = buildObjectSchema({
	id: BaseStringSchema.trim().hex().length(24)
})
