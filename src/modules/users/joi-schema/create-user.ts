import {BaseStringSchema, buildObjectSchema} from '../../../shared/schemas'

const name = BaseStringSchema.trim().min(3).max(256)
const email = BaseStringSchema.trim()
const password = BaseStringSchema.trim().min(8).max(256)

export const CreateUserJoiSchema = buildObjectSchema({
	firstName: name.required(),
	lastName: name.required(),
	email: email.required(),
	password: password.required()
})
