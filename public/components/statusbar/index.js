import util from "../util";

async function setup(style_src) {
	const template = util.loadTemplate(style_src);

	return class StatusBar extends HTMLDivElement {
		constructor() {
			super();
		}
	}
}