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

import addressbarSetup from './components/address-bar/index.js'
const AddressBar = await addressbarSetup(style_src);
defines.push(['address-bar', AddressBar, 'div']);

import menubarSetup from './components/menu-bar/index.js'
const MenuBar = await menubarSetup(style_src);
defines.push(['menu-bar', MenuBar, 'div']);

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

import initWindowManager from './window-manager.js'

function init() {
	defineAll();
	initWindowManager();
}

export { init, Alert, TaskBar, Gallery, Minesweeper }