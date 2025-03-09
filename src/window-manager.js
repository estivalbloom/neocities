import { querySelectorAllDeep } from "query-selector-shadow-dom";

export default function() {

	const taskbar = document.querySelector('[is="win-task-bar"]');
	const taskbar_item_container = document.createElement('div');
	taskbar_item_container.setAttribute('slot', 'open-windows');
	taskbar_item_container.id = 'taskbar-item-container';
	taskbar.appendChild(taskbar_item_container);

	const observer_targets = Array
		.from(document.querySelectorAll('[is]'))
		.filter(e => e.shadowRoot)
		.map(e => e.shadowRoot);
	observer_targets.push(document);

	let titles = new Array();
	let visibility = new Array();

	function isVisible(element) {
		let current = element;
		while (current) {
			const currentStyle = getComputedStyle(current);
			if (currentStyle.display === 'none') {
				return false;
			}
			current = current.parentElement;
		}
		return true;
	}

	function updateVisibility() {
		titles = Array.from(querySelectorAllDeep('.title-bar-text'));
		let changed = false;

		if (titles.length != visibility.length) {
			visibility = new Array(titles.length);
			changed = true;
		}

		visibility = titles.map((t, idx) => {
			const new_val = isVisible(t);
			if (visibility[idx] !== new_val) {
				changed = true;
			}
			return new_val;
		});
		return changed;
	}

	function populateTaskbar() {
		taskbar_item_container.innerHTML = '';
		let last_active;
		let last_parent;
		titles.forEach((t, idx) => {
			if (!visibility[idx]) {
				return;
			}

			const item = document.createElement('div');
			item.innerHTML = t.innerHTML;
			item.classList.add('taskbar-item');
			t.parentElement.classList.add('inactive');
			taskbar_item_container.appendChild(item);

			last_active = item;
			last_parent = t.parentElement;
		});
		last_active?.classList.add('taskbar-item-active');
		last_parent?.classList.remove('inactive');
	}

	// TODO: maybe disconnect and reconnect to avoid unnecessary updates
	function update() {
		console.log('update');
		if (updateVisibility()) {
			populateTaskbar();
		}
	}

	const observer = new MutationObserver(() => update());

	const observer_cfg = {
		attributes: true,
		attributeFilter: ['style', 'class'],
		subtree: true,
		childList: true
	};

	observer_targets.forEach(e => observer.observe(e, observer_cfg));
}