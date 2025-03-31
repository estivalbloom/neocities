import path from 'path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from "vite"
import { routes } from './src/route-info'
import { og_plugin } from './src/plugins/opengraph-gen'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const input = Object.fromEntries(
	routes.map(pair => {
		return [pair[0], path.resolve(__dirname, `${pair[1]}.html`)]
	})
);

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
			input: input
		}
	},
	plugins: [
		og_plugin()
	]
});