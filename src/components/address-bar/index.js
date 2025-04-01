import { parseTemplate, initShadow, applyStyle, useDeference } from "../../util.js";
import template_html from './template.html?raw'
import { routeObjs, routeMap } from "../../route-info.js";

async function setup(style_src) {
	const template = parseTemplate(template_html);

	class AddressBar extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);
			applyStyle(shadow, '/assets/style.css');

			const address = shadow.querySelector('#address');

			this._icon_elem = shadow.querySelector('#icon');
			const url = new URL(document.URL);
			let route = url.pathname;
			if (route.endsWith('.html')) {
				route = route.slice(1, -5);
			}
			if (route.startsWith('/')) {
				route = route.slice(1);
			}
			const routeInfo = routeObjs.find(e => e.path === route || e.path === `${route}index`);
			const parts = []
			for(let currentInfo = routeMap.get(routeInfo.parent); currentInfo; currentInfo = routeMap.get(currentInfo.parent)) {
				parts.push(currentInfo);
			}
			parts.reverse();
			parts.forEach(e => {
				const link = document.createElement('a');
				link.href = `/${e.path}.html`;
				link.textContent = e.name;
				address.appendChild(link);
				const sep = document.createElement('div');
				sep.textContent = '/';
				address.appendChild(sep);
			});
			const current = document.createElement('div');
			current.textContent = routeInfo.name;
			address.appendChild(current);
		}

		static get observedAttributes() {
			return ['icon-src'];
		}

		attributeChangedCallback(name, _oldVal, newVal) {
			switch (name) {
				case 'icon-src':
				this._icon_elem.src = newVal;
			}
		}
	}

	useDeference(AddressBar, AddressBar.prototype.attributeChangedCallback, AddressBar.prototype.connectedCallback);

	return AddressBar
}

export default setup
