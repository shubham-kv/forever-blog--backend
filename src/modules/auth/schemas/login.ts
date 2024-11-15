import {BaseStringSchema, buildObjectSchema} from '../../../shared/schemas'

const email = BaseStringSchema.trim().email()
const password = BaseStringSchema.trim().min(8).max(16)

export const LoginSchema = buildObjectSchema({
	email: email.required(),
	password: password.required()
})
