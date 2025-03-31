import path from 'path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from "vite"

const base_url = 'https://estivalbloom.neocities.org';
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// name | path | display
export const routes = [
	['main', 		'index',				'Home'			],
	['about',	 	'src/about',			'About Me'		],
	['code', 		'src/code/index',		'Code',			],
	['moji', 		'src/code/moji-mash',	'Moji Mash'		],
	['pix_water', 	'src/code/pixel-water',	'Pixel Water'	],
	['term_game', 	'src/code/term-game',	'Terminal Game'	],
	['matrix_text', 'src/code/matrix-text',	'Matrix Text'	],
	['art', 		'src/art',				'Art'			],
	['kandi', 		'src/kandi',			'Kandi'			],
	['dev_diary', 	'src/dev-diary',		'Dev Diary'		]
];

const input = Object.fromEntries(
	routes.map(pair => {
		return [pair[0], path.resolve(__dirname, `${pair[1]}.html`)]
	})
);

/** @typedef {import('vite').HtmlTagDescriptor} HtmlTagDescriptor */
/**
 * Injects opengraph meta tags into each endpoint.
 * @returns {import('vite').Plugin}
 */
function og_plugin() {
	return {
		name: 'og-transform',
		transformIndexHtml(_html, context) {
			const url = new URL(context.path, base_url).href;
			const page_dir = path.dirname(context.path);
			const page_name = path.basename(context.path, '.html');
			const relative_preview_path = path.join(page_dir, `${page_name}.png`);
			const preview_path = path.join('/assets/previews', relative_preview_path);
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