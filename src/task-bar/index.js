import { loadTemplate, initShadow, wrapClick } from "/src/util.js";
const template_path = '/src/task-bar/template.html'
const timefmt = new Intl.DateTimeFormat('en-US', {
	hour12: true,
	timeStyle: 'short'
});
const datefmt = new Intl.DateTimeFormat('en-US', {
	dateStyle: 'full'
})
// Wednesday, January 22, 2025
const clock_width = 60;
const clock_width_px = `${clock_width}px`

async function setup(style_src) {
	const template = await loadTemplate(template_path);

	return class TaskBar extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			this._shadow = initShadow(this, template, style_src);
			
			const start_button = this._shadow.querySelector('#start-button');
			wrapClick(this, start_button, 'startclick');

			const clock = this._shadow.querySelector('#clock');
			clock.style.minWidth = clock_width_px;
			clock.style.maxWidth = clock_width_px
			const clock_text = this._shadow.querySelector('#clock-text');
			this._clock_handler_id = setInterval(() => {
				const now = new Date(Date.now());
				clock_text.textContent = timefmt.format(now);
				const text_width = clock_text.clientWidth;
				const half_space = (clock_width - text_width) / 2;
				clock_text.style.left = `${Math.ceil(half_space)}px`;
				clock.dataset.tooltip = datefmt.format(now);
			}, 500);
		}

		disconnectedCallback() {
			clearInterval(this._clock_handler_id)
		}
	}
}

export default setup