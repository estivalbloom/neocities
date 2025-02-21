const style_src = 'https://unpkg.com/98.css';

import alertSetup from './alert/index.js'
const Alert = await alertSetup(style_src)

function defineAll() {
	customElements.define('win-alert', Alert, { extends: 'div' });
}

export { defineAll, Alert }