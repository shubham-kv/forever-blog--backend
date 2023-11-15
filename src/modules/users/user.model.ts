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
		},
		posts: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Post'
			}
		]
	},
	{
		timestamps: true
	}
)

export const User = model('User', UserSchema)
