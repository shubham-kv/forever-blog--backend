import pino from 'pino'

const transport = pino.transport({
	targets: [
		{
			target: 'pino-pretty',
			level: 'info'
		}
	]
})

export const logger = pino(transport)
