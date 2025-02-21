import util from "/components/util.js";

async function setup(style_src) {
	const template = await util.loadTemplate('/components/alert/template.html');

	class Alert extends HTMLDivElement {
		constructor() {
			super();
			this.closeable = true;
		}
		connectedCallback() {
			const shadow = this.attachShadow({ mode: 'open' });
			shadow.appendChild(template.content.cloneNode(true));
			util.applyStyle(shadow, style_src);

			const close_button = shadow.querySelector('#close-button');
			const ok_button = shadow.querySelector('#ok-button');
			const cancel_button = shadow.querySelector('#cancel-button');
			this._title_text_elem = shadow.querySelector('#title-text');

			close_button.addEventListener('click', e => {
				if (this.closeable) {
					this.remove();
				}
				e.stopPropagation();
				e.preventDefault();
			});

			ok_button.addEventListener('click', e => util.wrapAndDispatch(this, 'okclick', e));

			cancel_button.addEventListener('click', e => util.wrapAndDispatch(this, 'cancelclick', e));

			console.log(this)
		}

		static get observedAttributes() {
			return ['title-text', 'closeable']
		};

		_onTitleChange(_oldVal, newVal) {
			this._title_text_elem.textContent = newVal;
		}

		_onCloseableChange(_oldVal, newVal) {
			this._closeable = newVal;
		}

		attributeChangedCallback(name, oldVal, newVal) {
			switch (name) {
				case 'title-text':
					this._onTitleChange(oldVal, newVal);
					break;
				case 'closeable':
					this._onCloseableChange(oldVal, newVal);
					break;
			}
		}
	}

	util.useDeference(Alert, Alert.prototype.attributeChangedCallback, Alert.prototype.connectedCallback);

	return Alert;
}

export default setup