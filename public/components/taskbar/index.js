import util from "/components/util.js";
const template_path = '/components/taskbar/template.html'
const style_path = '/components/taskbar/style.css'

async function setup(style_src) {
	const template = await util.loadTemplate(template_path);

	return class TaskBar extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const shadow = util.initShadow(this, template, style_src);
			util.applyStyle(shadow, style_path);
		}
	}
}

export default setup