import {UserEntity} from '../../src/shared/modules/user'

declare global {
	namespace Express {
		interface Request {
			user?: UserEntity
		}
	}
}
