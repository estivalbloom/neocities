const style_src = 'https://unpkg.com/98.css';

let defines = []

import alertSetup from '/components/alert/index.js'
const Alert = await alertSetup(style_src);
defines.push(['win-alert', Alert, 'div']);

import taskbarSetup from '/components/task-bar/index.js'
const TaskBar = await taskbarSetup(style_src);
defines.push((['win-task-bar', TaskBar, 'div']));

import navitemSetup from '/components/nav-item/index.js'
const NavItem = await navitemSetup(style_src);
defines.push((['nav-item', NavItem, 'div']));

function defineAll() {
	defines.forEach((data) => {
		const [tag, classObj, base] = data;
		customElements.define(tag, classObj, { extends: base });
	})
}

const classes = defines.map(e => e[1]);

export { defineAll, Alert, TaskBar, NavItem }