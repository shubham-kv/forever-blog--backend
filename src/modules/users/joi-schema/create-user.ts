import {BaseStringSchema, buildObjectSchema} from '../../../shared/schemas'

const name = BaseStringSchema.trim().min(3).max(100)
const email = BaseStringSchema.trim().email().min(1).max(100)
const password = BaseStringSchema.trim().min(8).max(32)

export const CreateUserJoiSchema = buildObjectSchema({
	firstName: name.required(),
	lastName: name.required(),
	email: email.required(),
	password: password.required()
})
