import path from 'path'
import {defineConfig} from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['**/*-e2e.spec.ts'],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, '../../src')
		}
	}
})
