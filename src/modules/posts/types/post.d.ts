import {PostEntity} from '../../../shared/modules/post'

export type Post = Pick<PostEntity, 'id' | 'title' | 'content'>
