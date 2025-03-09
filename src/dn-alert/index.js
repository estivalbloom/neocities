import { parseTemplate } from '/src/util.js'
import template_html from './template.html?raw'
import A11yDialog from 'a11y-dialog'

customElements.whenDefined('win-alert').then(() => {
	const template = parseTemplate(template_html)
	document.body.appendChild(template.content.cloneNode(true));

	const dialogEl = document.querySelector('#modal-alert');
	const dialog = new A11yDialog(dialogEl);

	const task_bar = document.querySelector('#task-bar');
	const title_bar = document.querySelector('#page-title-bar');
	const alert_elem = document.querySelector('#dn-alert');

	dialogEl.addEventListener('click', () => alert_elem.ding());
	alert_elem.addEventListener('closeclick', () => alert_elem.ding());
	alert_elem.addEventListener('cancelclick', () => alert_elem.ding());

	alert_elem.addEventListener('okclick', () => {
		title_bar.classList.remove('inactive');
		dialog.hide();
	});

	task_bar.addEventListener('startclick', () => {
		dialog.show();
		alert_elem.ding();
		alert_elem.setFocus('ok');
	});
})