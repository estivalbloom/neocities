import { launch } from 'puppeteer';
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as fs from 'fs/promises';
import { exit } from 'node:process';
import { routes } from './vite.config.js';
import path from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url))

const OUTPUT_DIR = resolve(__dirname, 'public', 'assets', 'previews');
const CONFIG = {
	base_url: 'http://localhost:5173', // Your Vite dev server URL
	output_path: OUTPUT_DIR,
	viewport: {
		width: 1280,
		height: 720
	},
	wait_for_selector: null,
	addtional_wait: 500
};
const route_paths = routes.map(e => e[1]);

async function get_screenshot(browser, page_path, cfg) {
	const url = new URL(`${page_path}.html`, cfg.base_url);
	const output_file_path = resolve(cfg.output_path, `${page_path}.png`);
	const output_file_dir = path.dirname(output_file_path);

	await fs.mkdir(output_file_dir, { recursive: true });

	console.log(`Generating preview for ${url}`);

	const page = await browser.newPage();

	// Set viewport to social media preview dimensions
	await page.setViewport(cfg.viewport);

	// Navigate to the page
	await page.goto(url, { waitUntil: 'networkidle2' });

	// Optional: Wait for a specific element to ensure the page is fully rendered
	if (cfg.wait_for_selector) {
		await page.waitForSelector(cfg.wait_for_selector);
	}

	// Optional: Wait additional time for animations or dynamic content
	if (cfg.addtional_wait > 0) {
      await new Promise(resolve => setTimeout(resolve, cfg.addtional_wait));
	}

	// Take screenshot
	await page.screenshot({
		path: output_file_path,
		type: 'png',
		fullPage: false
	});

	console.log(`Preview image saved to: ${output_file_path}`);
}

async function generate_previews(routes, cfg) {
	console.log('Starting preview browser...');
	// Launch browser
	const browser = await launch({
		headless: 'new',
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		browser: 'firefox'
	});
	
	try {
		for(let route of routes) {
			await get_screenshot(browser, route, cfg);
		}
	} catch (error) {
		console.error('Error generating preview image:', error);
		exit(1);
	} finally {
		await browser.close();
	}
}

await generate_previews(route_paths, CONFIG);