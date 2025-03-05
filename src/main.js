const style_src = 'https://unpkg.com/98.css@0.1.20/dist/98.css';

let defines = []

import alertSetup from './components/alert/index.js'
const Alert = await alertSetup(style_src);
defines.push(['win-alert', Alert, 'div']);

import taskbarSetup from './components/task-bar/index.js'
const TaskBar = await taskbarSetup(style_src);
defines.push(['win-task-bar', TaskBar, 'div']);

import gallerySetup from './components/gallery/index.js'
const Gallery = await gallerySetup(style_src);
defines.push(['image-gallery', Gallery, 'div']);

import minesweeperSetup from './components/minesweeper/index.js'
const Minesweeper = await minesweeperSetup(style_src);
defines.push(['minesweeper-dlg', Minesweeper, 'div']);

function defineAll() {
	defines.forEach((data) => {
		const [tag, classObj, base] = data;
		customElements.define(tag, classObj, { extends: base });
	});
}

document.querySelector('#minesweeper-button').addEventListener('click', () => {
	const minesweeper = document.querySelector('#minesweeper');
	minesweeper.start();
});

export { defineAll, Alert, TaskBar, Gallery, Minesweeper }