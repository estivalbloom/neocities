import { parseTemplate, initShadow } from "../../util.js";
import template_html from './template.html?raw'
import A11yDialog from 'a11y-dialog'

async function setup(style_src) {
	const template = parseTemplate(template_html);

	const directions = [
		{ x: -1, y: -1 },
		{ x: 0, y: -1 },
		{ x: 1, y: -1 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: 1 },
		{ x: -1, y: 1 },
		{ x: -1, y: 0 }
	]

	class Minesweeper extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			this._shadow = initShadow(this, template, style_src);

			const dialogEl = this._shadow.querySelector('#modal-minesweeper');
			this._dialog = new A11yDialog(dialogEl);

			this._field = this._shadow.querySelector('#minefield');
			this._field_data = [];
			this._buttons = [];
			this._field_width = 0;
			this._field_height = 0;
			this._field.addEventListener('mousedown', () => {
				this._smiley_button.dataset.mood = 'worried'
			});
			document.addEventListener('mouseup', () => {
				if(this._smiley_button.dataset.mood === 'worried') {
					this._smiley_button.dataset.mood = 'normal';
				}
			});
			
			this._overlay = this._shadow.querySelector('#minefield-overlay');
			this._overlay.addEventListener('contextmenu', (e) => {
				e.preventDefault();
			})

			this._flag_counter = this._shadow.querySelector('#flag-count');
			this._time_counter = this._shadow.querySelector('#timer');

			this._smiley_button = this._shadow.querySelector('#smiley');
			this._smiley_button.addEventListener('click', () => this.start())
			this._smiley_button.dataset.mood = 'normal';

			this._interval_id = null;
		}

		idxOf(x, y) {
			return x + y * this._field_width;
		}

		posOf(idx) {
			return { x: idx % this._field_width, y: Math.floor(idx / this._field_width) };
		}

		isOutOfBounds(x, y) {
			return (x < 0 || x >= this._field_width || y < 0 || y >= this._field_height);
		}

		valueAt(x, y) {
			if (this.isOutOfBounds(x, y)) {
				return 0;
			}

			const idx = this.idxOf(x, y);
			return this._field_data.at(idx);
		}

		incIfNotMine(x, y) {
			if (this.isOutOfBounds(x, y)) {
				return;
			}

			const idx = this.idxOf(x, y);
			if (this._field_data.at(idx) >= 0) {
				this._field_data[idx] = this._field_data[idx] + 1;
			}
		}

		stopTimer() {
			if (this._interval_id) {
				clearInterval(this._interval_id);
				this._interval_id = null;
			}
		}

		gameOver(win) {
			this._field.inert = true;
			this._overlay.inert = '';
			this.stopTimer();
			this._smiley_button.dataset.mood = win ? 'win' : 'lose';
		}

		reveal(x, y) {
			if (this.isOutOfBounds(x, y)) {
				return;
			}

			const idx = this.idxOf(x, y);
			const button = this._buttons[idx];
			if (button.style.visibility === 'hidden' || button.dataset.flagged === 'true') {
				return;
			}

			if (!this._interval_id) {
				this._interval_id = setInterval(() => this.time_elapsed++, 1000);
			}

			this._buttons[idx].style.visibility = 'hidden';
			const value = this.valueAt(x, y);

			if (value == -1) {
				this.gameOver(false);
				this._revealed[idx].dataset.clickedMine = 'true';
				return;
			}

			this._remaining_squares--;
			if (this._remaining_squares == 0) {
				this.gameOver(true);
				return;
			}

			if (value == 0) {
				directions.forEach(d => {
					this.reveal(x + d.x, y + d.y);
				});
			}
		}

		setFlagCounter(val) {
			this._flag_counter.children[0].dataset.value = Math.floor((val / 100) % 10);
			this._flag_counter.children[1].dataset.value = Math.floor((val / 10) % 10);
			this._flag_counter.children[2].dataset.value = Math.floor(val % 10);
		}

		setTimer(val) {
			this._time_counter.children[0].dataset.value = Math.floor((val / 100) % 10);
			this._time_counter.children[1].dataset.value = Math.floor((val / 10) % 10);
			this._time_counter.children[2].dataset.value = Math.floor(val % 10);
		}

		set flag_count(val) {
			this._flag_count = val;
			this.setFlagCounter(val);
		}

		get flag_count() {
			return this._flag_count;
		}

		set time_elapsed(val) {
			this._time = val;
			this.setTimer(val);
		}

		get time_elapsed() {
			return this._time;
		}

		toggleFlag(button) {
			if (button.dataset.flagged === 'true') {
				button.dataset.flagged = false;
				this.flag_count++;
			}
			else {
				button.dataset.flagged = true;
				this.flag_count--;
			}
		}

		isFlagged(x, y) {
			if (this.isOutOfBounds(x, y)) {
				return false;
			}


			const idx = this.idxOf(x, y);
			return this._buttons[idx].dataset.flagged === 'true';
		}

		autoClear(x, y) {
			const neighbor_flags = directions.reduce((v, d) => {
				const n_x = x + d.x;
				const n_y = y + d.y;
				if (this.isFlagged(n_x, n_y)) {
					return v + 1;
				}
				return v;
			}, 0);

			if (neighbor_flags === this.valueAt(x, y)) {
				directions.forEach(d => {
					const n_x = x + d.x;
					const n_y = y + d.y;
					this.reveal(n_x, n_y);
				})
			}
		}

		setupField(width, height, mines) {
			this.flag_count = mines;
			this.time_elapsed = 0;
			this._smiley_button.dataset.mood = 'normal';
			this._field.inert = '';
			this._overlay.inert = true;

			const field_data = new Array(height * width);
			field_data.fill(0);
			this._field_width = width;
			this._field_height = height;
			this._field_data = field_data;
			this._remaining_squares = field_data.length - mines;

			let mines_remaining = mines;
			for (let i = 0; i < field_data.length; i++) {
				const spaces_remaining = field_data.length - (i + 1);
				const p = mines_remaining / spaces_remaining;
				if (Math.random() < p) {
					field_data[i] = -1;
					mines_remaining--;

					const pos = this.posOf(i);
					directions.forEach(d => {
						const n_x = pos.x + d.x;
						const n_y = pos.y + d.y;
						this.incIfNotMine(n_x, n_y);
					})
				}
			}

			this._field.innerHTML = '';
			this._buttons = [];
			this._revealed = [];
			for (let j = 0; j < height; j++) {
				const row = document.createElement('div');
				row.classList.add('minefield-row');
				for (let i = 0; i < width; i++) {
					const square = document.createElement('div');
					square.classList.add('minesweeper-square');

					const revealed = document.createElement('div');
					revealed.classList.add('square-revealed');
					revealed.dataset.value = this.valueAt(i, j);
					revealed.addEventListener('auxclick', () => {
						this.autoClear(i, j);
					});
					this._revealed.push(revealed);

					const button = document.createElement('button')
					button.classList.add('square-button');
					button.classList.add('custom-outset');
					button.addEventListener('click', () => {
						this.reveal(i, j);
					});
					button.addEventListener('contextmenu', (e) => {
						e.preventDefault();
						this.toggleFlag(button);
						return false;
					});
					this._buttons.push(button);

					square.appendChild(revealed);
					square.appendChild(button);
					row.appendChild(square);
				}
				this._field.appendChild(row);
			}
		}

		start() {
			this._dialog.show();
			this.setupField(30, 16, 99);
		}
	}

	return Minesweeper
}

export default setup
