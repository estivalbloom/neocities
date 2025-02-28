import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from "vite"

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	optimizeDeps: {
		include: ['moji-mash'],
		esbuildOptions: {
			supported: {
				'top-level-await': true
			}
		}
	},
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
				code: resolve(__dirname, 'src/code/index.html'),
				moji: resolve(__dirname, 'src/code/moji-mash.html'),
				pix_water: resolve(__dirname, 'src/code/pixel-water.html'),
				art: resolve(__dirname, 'src/art.html'),
				dev_diary: resolve(__dirname, 'src/dev-diary.html')
			}
		}
	}
})