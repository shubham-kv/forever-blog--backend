import {Schema, model} from 'mongoose'

export const PostSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			max: 256
		},
		content: {
			type: String,
			required: true
		},
		author: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	},
	{
		timestamps: true
	}
)

export const Post = model('Post', PostSchema)
