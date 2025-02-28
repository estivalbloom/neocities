import { parseTemplate } from '/src/util.js'
import template_html from './template.html?raw'

customElements.whenDefined('win-alert').then(() => {
	const template = parseTemplate(template_html)
	const body = document.querySelector('body');
	body.appendChild(template.content.cloneNode(true));

	const modal_container = document.querySelector('#modal-alert');
	const task_bar = document.querySelector('#task-bar');
	const title_bar = document.querySelector('#page-title-bar');
	const alert_elem = document.querySelector('#dn-alert');

	alert_elem.addEventListener('closeclick', () => {
		alert_elem.ding();
	})

	alert_elem.addEventListener('cancelclick', () => {
		alert_elem.ding();
	})

	alert_elem.addEventListener('okclick', () => {
		title_bar.classList.remove('inactive');
		modal_container.style.visibility = 'hidden';
		task_bar.focusStart();
	});

	task_bar.addEventListener('startclick', () => {
		title_bar.classList.add('inactive');
		modal_container.style.visibility = 'visible';
		alert_elem.ding();
		alert_elem.setFocus('ok');
	});
})