import { parseTemplate, initShadow } from "/src/util.js";
import template_html from './template.html?raw'

async function setup(style_src) {
	const template = parseTemplate(template_html);

	class Gallery extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);
		
		}
	}

	return Gallery
}

export default setup
