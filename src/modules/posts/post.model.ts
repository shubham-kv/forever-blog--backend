import {Schema, model} from 'mongoose'

export const PostSchema = new Schema({
	title: {
		type: String,
		required: true,
		max: 256
	},
	content: {
		type: String,
		required: true
	}
})

export const Post = model('Post', PostSchema)
