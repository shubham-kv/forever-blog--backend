import {PostEntity} from '../post.entity'

export type Post = Pick<PostEntity, 'id' | 'title' | 'content'>
