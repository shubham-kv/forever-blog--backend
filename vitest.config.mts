import path from 'path'
import {defineConfig} from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'node',
		include: ['**/*.(spec|test).(ts|js)']
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	}
})
