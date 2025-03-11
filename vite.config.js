import { dirname, resolve, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from "vite"

const base_url = 'https://estivalbloom.neocities.org';
const __dirname = dirname(fileURLToPath(import.meta.url))

export const routes = [
	['main', 		'index'					],
	['about',	 	'src/about'				],
	['code', 		'src/code/index'		],
	['moji', 		'src/code/moji-mash'	],
	['pix_water', 	'src/code/pixel-water'	],
	['term_game', 	'src/code/term-game'	],
	['matrix_text', 'src/code/matrix-text'	],
	['art', 		'src/art'				],
	['kandi', 		'src/kandi'				],
	['dev_diary', 	'src/dev-diary'			]
];

const input = Object.fromEntries(
	routes.map(pair => {
		return [pair[0], resolve(__dirname, `${pair[1]}.html`)]
	})
);

/** @typedef {import('vite').HtmlTagDescriptor} HtmlTagDescriptor */
/**
 * Injects opengraph meta tags into each endpoint.
 * @returns 
 */
function og_plugin() {
	return {
		name: 'og-transform',
		transformIndexHtml(_html, context) {
			const url = new URL(context.path, base_url).href;
			const preview_path = posix.join('/assets/previews', posix.basename(context.path, '.html') + '.png');
			const preview_url = new URL(preview_path, base_url).href;
			return [
				{
					tag: 'meta',
					attrs: {
						property: 'og:url',
						content: url
					}
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: preview_url
					}
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:type',
						content: 'website'
					}
				}
			]
		}
	}
}

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