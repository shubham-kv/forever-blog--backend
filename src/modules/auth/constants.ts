import {randomBytes} from 'crypto'

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password'
export const REFRESH_TOKEN_COOKIE = randomBytes(12).toString('hex')
