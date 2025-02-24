import { loadTemplate, initShadow, wrapClick, useDeference } from "/src/util.js";
const template_path = '/src/alert/template.html'

async function setup(style_src) {
	const template = await loadTemplate(template_path);

	class Alert extends HTMLDivElement {
		constructor() {
			super();
			this.closeable = true;
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);

			const close_button = shadow.querySelector('#close-button');
			const ok_button = shadow.querySelector('#ok-button');
			const cancel_button = shadow.querySelector('#cancel-button');
			this._title_text_elem = shadow.querySelector('#title-text');

			wrapClick(this, ok_button, 'okclick');
			wrapClick(this, cancel_button, 'cancelclick');
			wrapClick(this, close_button, 'closeclick');

			this._ding = shadow.querySelector('#ding');
		}

		static get observedAttributes() {
			return ['title-text']
		};

		// Early calls will defer until connectedCallback()
		attributeChangedCallback(name, oldVal, newVal) {
			switch (name) {
				case 'title-text':
					this._title_text_elem.textContent = newVal;
					break;
			}
		}

		ding() {
			this._ding.play();
		}
	}

	// Only thing I don't like about this is that I'd like it inside the class def
	useDeference(Alert, Alert.prototype.attributeChangedCallback, Alert.prototype.connectedCallback);

	return Alert;
}

export default setup