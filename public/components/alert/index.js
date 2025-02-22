import util from "/components/util.js";
const template_path = '/components/alert/template.html'
const style_path = '/components/alert/style.css'

async function setup(style_src) {
	const template = await util.loadTemplate(template_path);

	class Alert extends HTMLDivElement {
		constructor() {
			super();
			this.closeable = true;
		}

		connectedCallback() {
			const shadow = util.initShadow(this, template, style_src);
			util.applyStyle(shadow, style_path)

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

		// Early calls will defer until connectedCallback()
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

	// Only thing I don't like about this is that I'd like it inside the class def
	util.useDeference(Alert, Alert.prototype.attributeChangedCallback, Alert.prototype.connectedCallback);

	return Alert;
}

export default setup