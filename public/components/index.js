const style_src = 'https://unpkg.com/98.css';

let defines = []

import alertSetup from '/components/alert/index.js'
const Alert = await alertSetup(style_src);
defines.push(['win-alert', Alert, 'div']);

import taskbarSetup from '/components/taskbar/index.js'
const TaskBar = await taskbarSetup(style_src);
defines.push((['win-task-bar', TaskBar, 'div']));

function defineAll() {
	defines.forEach((data) => {
		const [tag, classObj, base] = data;
		customElements.define(tag, classObj, { extends: base });
	})
}

export { defineAll, Alert, TaskBar }