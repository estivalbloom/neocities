import { loadTemplate, initShadow, applyStyle, wrapClick, useDeference } from "/components/util.js";
const template_path = '/components/nav-item/template.html'
const style_path = '/components/nav-item/style.css'

async function setup(style_src) {
	const template = await loadTemplate(template_path);

	class NavItem extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);
			applyStyle(shadow, style_path);

			this._icon = shadow.querySelector('#nav-icon');
			this._title = shadow.querySelector('#nav-title');
			this._desc = shadow.querySelector('#nav-desc');
		}

		static get observedAttributes() {
			return ['icon-src', 'title', 'desc', 'title-width'];
		}

		// Early calls will defer until connectedCallback()
		attributeChangedCallback(name, _oldVal, newVal) {
			switch (name) {
				case 'icon-src':
					this._icon.src = newVal;
					break;
				case 'title':
					this._title.textContent = newVal;
					break;
				case 'desc':
					this._desc.textContent = newVal;
					break;
				case 'title-width':
					this._title.style.maxWidth = newVal;
					this._title.style.minWidth = newVal;
					break;
			}
		}
	}

	useDeference(NavItem, NavItem.prototype.attributeChangedCallback, NavItem.prototype.connectedCallback);
	
	return NavItem
}

export default setup
