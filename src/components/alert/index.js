import { parseTemplate, initShadow, wrapClick } from "/src/util.js";
import template_html from './template.html?raw'

async function setup(style_src) {
	const template = parseTemplate(template_html);

	class Alert extends HTMLDivElement {
		constructor() {
			super();
			this.closeable = true;
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);

			this._close_button = shadow.querySelector('#close-button');
			this._ok_button = shadow.querySelector('#ok-button');
			this._cancel_button = shadow.querySelector('#cancel-button');
			this._title_text_elem = shadow.querySelector('#title-text');

			wrapClick(this, this._ok_button, 'okclick');
			wrapClick(this, this._cancel_button, 'cancelclick');
			wrapClick(this, this._close_button, 'closeclick');

			this._ding = shadow.querySelector('#ding');
		}

		ding() {
			this._ding.fastSeek(0);
			this._ding.play();
		}

		setFocus(button) {
			switch (button) {
				case "ok":
					this._ok_button.focus()
					break;
				case "cancel":
					this._cancel_button.focus()
					break;
				case "close":
					this._close_button.focus()
					break;
			}
		}
	}

	return Alert;
}

export default setup