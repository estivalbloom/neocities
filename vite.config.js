import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from "vite"


const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	esbuild: {
		supported: {
			'top-level-await': true
		}
	},
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				about: resolve(__dirname, 'src/about.html'),
				code: resolve(__dirname, 'src/code.html')
			}
		}
	}
})