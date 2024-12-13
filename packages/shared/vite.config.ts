import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	plugins: [dts()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['cjs'],
		},
		rollupOptions: {
			input: {
				index: resolve(__dirname, 'src/index.ts'),
			},
			output: {
				entryFileNames: '[name].js',
			},
		},
	},
})
