import { parseTemplate, initShadow, applyStyle } from "../../util.js";
import template_html from './template.html?raw'

/** 
 * Holds data about a menu bar item
 * @typedef {Object} ItemInfo 
 * @property {string} name
 * @property {number} underlineIdx Index of alt shortcut underline
 * @property {CSSStyleDeclaration} [customStyle]
 */

async function setup(style_src) {
	const template = parseTemplate(template_html);

	class MenuBar extends HTMLDivElement {
		constructor() {
			super();
		}

		/**
		 * @returns {Array.<ItemInfo>}
		 */
		static get defaultItems() {
			return [
				{ name: 'File',			underlineIdx: 0 },
				{ name: 'Edit', 		underlineIdx: 0 },
				{ name: 'View', 		underlineIdx: 0 },
				{ name: 'Favorites',	underlineIdx: 1 },
				{ name: 'Tools',		underlineIdx: 0	},
				{ name: 'Help',			underlineIdx: 0 }
			];
		}

		/**
		 * Adds a menu item to the bar
		 * @param {ItemInfo} item 
		 */
		addItem(item) {
			const name = item.name;
			const ulIdx = item.underlineIdx
			const itemElem = document.createElement('div');
			itemElem.classList.add('item');
			itemElem.style.cssText = item.customStyle?.cssText;
			if (ulIdx >= 0) {
				const shortcutChar = document.createElement('div');
				shortcutChar.textContent = name.at(ulIdx);
				shortcutChar.classList.add('shortcut');
				itemElem.append(name.slice(0, ulIdx), shortcutChar, name.slice(ulIdx + 1));
			}
			else {
				itemElem.append(name);
			}
			this._container.appendChild(itemElem);
		}

		/**
		 * Populate the bar with menu items
		 * @param {Array.<ItemInfo>} [itemData]
		 */
		populate(itemData) {
			this._container.innerHTML = '';
			const hasItems = itemData && itemData.length;
			const items = hasItems ? itemData : MenuBar.defaultItems
			items.forEach(e => this.addItem(e));
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);
			applyStyle(shadow, '/assets/style.css');

			this._container = shadow.querySelector('#container');

			const itemSlot = shadow.querySelector('slot[name="items"]');
			const slotItems = itemSlot.assignedElements().map(e => {
				return {
					name: e.textContent,
					underlineIdx: e.dataset.shortcut || -1,
					customStyle: e.style
				}
			});
			
			this.populate(slotItems);
		}
	}

	return MenuBar
}

export default setup
