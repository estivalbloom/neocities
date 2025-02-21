async function setup() {
	let response = await fetch('/components/alert/template.html');
	let html = await response.text();
	const parser = new DOMParser()
	const template = parser.parseFromString(html, 'text/html').querySelector('template');

	return class Alert extends HTMLDivElement {
		constructor() {
			super();
			this._isReady = false;
			this.closeable = true;
			this._pendingAttributes = {};
		}

		_wrapAndDispatch(name, original) {
			original.stopPropagation();
			original.preventDefault();
			this.dispatchEvent(new CustomEvent(name, { 
				detail: {
					original
				}
			}))
		}

		connectedCallback() {
			const shadow = this.attachShadow({ mode: 'open' });
			shadow.appendChild(template.content.cloneNode(true));

			const closeButton = shadow.querySelector('#close-button');
			const okButton = shadow.querySelector('#ok-button');
			const cancelButton = shadow.querySelector('#cancel-button');
			this._title_text_elem = shadow.querySelector('#title-text');

			// okButton.style.visibility = 'collapse'
			// cancelButton.style.visibility = 'collapse'

			closeButton.addEventListener('click', e => {
				if (this.closeable) {
					this.remove();
				}
				e.stopPropagation();
				e.preventDefault();
			});

			okButton.addEventListener('click', e => this._wrapAndDispatch('okclick', e));

			cancelButton.addEventListener('click', e => this._wrapAndDispatch('cancelclick', e));

			this._isReady = true;
			for (const [name, value] of Object.entries(this._pendingAttributes)) {
				this.attributeChangedCallback(name, null, value);
			}
			this._pendingAttributes = null;
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
			if (!this._isReady) {
				this._pendingAttributes[name] = newVal;
				return;
			}

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
}

export default await setup()