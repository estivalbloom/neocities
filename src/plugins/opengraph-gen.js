import path from 'path'

const base_url = 'https://estivalbloom.dev';

/** @typedef {import('vite').HtmlTagDescriptor} HtmlTagDescriptor */
/**
 * Injects opengraph meta tags into each endpoint.
 * @returns {import('vite').Plugin}
 */
export function og_plugin() {
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