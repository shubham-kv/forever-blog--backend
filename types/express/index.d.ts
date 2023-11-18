import {Request} from 'express'
import {UserEntity} from '../../src/shared/modules/user'

declare module 'express' {
	interface Request {
		user?: UserEntity
	}
}
