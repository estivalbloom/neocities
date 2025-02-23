import { loadTemplate, initShadow, applyStyle, wrapClick, useDeference } from "/components/util.js";
const template_path = '/components/nav-item/template.html'
const style_path = '/components/nav-item/style.css'

async function setup(style_src) {
	const template = await loadTemplate(template_path);

	class NavItem extends HTMLDivElement {
		constructor() {
			super();
			this._shadow = initShadow(this, template, style_src);
			applyStyle(this._shadow, style_path);
		}

		connectedCallback() {
			this._icon = this._shadow.querySelector('#nav-icon');
			this._title = this._shadow.querySelector('#nav-title');
			this._desc = this._shadow.querySelector('#nav-desc');
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
