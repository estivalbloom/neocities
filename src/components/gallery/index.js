import { parseTemplate, initShadow, useDeference, applyStyle } from "/src/util.js";
import template_html from './template.html?raw'
import A11yDialog from "a11y-dialog";

async function setup(style_src) {
	const template = parseTemplate(template_html);

	class Gallery extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);
			applyStyle(shadow, '/assets/style.css')
		
			this._image_container = shadow.querySelector('#image-container');
			this._modal = shadow.querySelector('#modal');
			this._modal_title = shadow.querySelector('#modal-title-text>div');
			this._modal_img = shadow.querySelector('#modal-img');
			this._modal_caption = shadow.querySelector('#modal-caption');
			this._modal_footer = shadow.querySelector('#modal-footer');

			this._close_button = shadow.querySelector('#close-button');

			this._dialog = new A11yDialog(this._modal);
		}

		static get observedAttributes() {
			return ['info-src', 'footer-fields'];
		};

		showModal(image, info) {
			this._modal.style.visibility = 'visible';
			this._modal_title.textContent = info.name;
			this._modal_img.src = image.src;
			this._modal_caption.innerHTML = info.caption;
			this._modal_caption.style.maxWidth = `${image.naturalWidth + 4}px`;
			this._dialog.show();
		}

		async populateGallery(info_path) {
			const info_req = await fetch(info_path);
			const info = await info_req.json();

			this._image_container.innerHTML = '';
			info.forEach(image_info => {
				const button = document.createElement('button');
				button.classList.add('image-button');
				const image = document.createElement('img');
				image.src = (new URL(`./${image_info.file}`, info_req.url)).href;
				image.classList.add('gallery-image');
				image.alt = image_info.name;

				button.addEventListener('click', (e) => {
					this.showModal(image,  image_info);
				})
				button.appendChild(image);

				const overlay = document.createElement('div');
				overlay.classList.add('image-overlay');
				button.appendChild(overlay);

				this._image_container.append(button);
			})
		}

		// Early calls will defer until connectedCallback()
		attributeChangedCallback(name, _oldVal, newVal) {
			switch (name) {
				case 'info-src':
					this.populateGallery(newVal);
					break;
			}
		}

	}

	// Only thing I don't like about this is that I'd like it inside the class def
	useDeference(Gallery, Gallery.prototype.attributeChangedCallback, Gallery.prototype.connectedCallback);

	return Gallery
}

export default setup
