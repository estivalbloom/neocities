import { querySelectorAllDeep } from "query-selector-shadow-dom";

function is_visible(element) {
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

function populate_taskbar(taskbar_item_container, titles) {
	taskbar_item_container.innerHTML = '';
	let last_active;
	let last_parent;
	titles.forEach(t => {
		t.parentElement.classList.add('inactive');
		last_parent = t.parentElement;
		last_active = null;

		if ('noTaskbar' in t.dataset) {
			return;
		}

		const item = document.createElement('div');
		item.innerHTML = t.innerHTML;
		item.classList.add('taskbar-item');
		taskbar_item_container.appendChild(item);
		last_active = item;
	});
	last_active?.classList.add('taskbar-item-active');
	last_parent?.classList.remove('inactive');
}

function update(root, taskbar_item_container, last_counts) {
	let titles = Array.from(querySelectorAllDeep('.title-bar-text', root));
	let visible = titles.filter(t => is_visible(t));
	if (last_counts.titles !== titles.length || last_counts.visible !== visible.length) {
		populate_taskbar(taskbar_item_container, visible);
	}

	return { titles: titles.length, visible: visible.length };
}

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

	// TODO: maybe disconnect and reconnect to avoid unnecessary updates
	let last_counts = {
		titles: -1,
		visible: -1
	};
	const observer = new MutationObserver(() => last_counts = update(document, taskbar_item_container, last_counts));

	const observer_cfg = {
		attributes: true,
		attributeFilter: ['style', 'class', 'aria-hidden'],
		subtree: true,
		childList: true
	};

	observer_targets.forEach(e => observer.observe(e, observer_cfg));
}