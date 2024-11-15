import bcrypt from 'bcrypt'
import {Schema, model} from 'mongoose'

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			max: 256
		},
		lastName: {
			type: String,
			required: true,
			max: 256
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
)

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next()
	}

	const salt = await bcrypt.genSalt(10)
	const hashed = await bcrypt.hash(this.password, salt)
	this.password = hashed
})

export const User = model('User', UserSchema)
