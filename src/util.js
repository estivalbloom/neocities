function parseTemplate(html) {
	const parser = new DOMParser()
	return parser.parseFromString(html, 'text/html').querySelector('template');
}

function applyStyle(shadow, src) {
	const style_link = document.createElement('link');
	style_link.setAttribute('rel', 'stylesheet');
	style_link.setAttribute('href', src);
	shadow.appendChild(style_link);
}

function initShadow(component, template, style_src) {
	const shadow = component.attachShadow({ mode: 'open' });
	shadow.appendChild(template.content.cloneNode(true));
	applyStyle(shadow, style_src);
	return shadow;
}

function useDeference(TargetClass, method_to_defer, required_method) {
	const deferred_name = method_to_defer.name;
	const required_name = required_method.name;
	const orig_deferred = method_to_defer;
	const orig_required = required_method;

	if (!orig_deferred || !orig_required) {
		throw new Error(`Methods ${deferred_name} and ${required_name} must both exist.`);
	}

	TargetClass.prototype[deferred_name] = function(...args) {
		if (!this.__deferredQueue) {
			this.__deferredQueue = [];
			this.__ready = false;
		}

		if (this.__ready) {
			return orig_deferred.apply(this, args);
		}

		this.__deferredQueue.push(args)
	}

	TargetClass.prototype[required_name] = function (...args) {
		let result = orig_required.apply(this, args);

		if (!this.__ready) {
			this.__ready = true;
			if (this.__deferredQueue) {
				for (const deferred_args of this.__deferredQueue) {
					orig_deferred.apply(this, deferred_args);
				}
				this.__deferredQueue = null;
			}
		}

		return result;
	}
}

function wrapAndDispatch(source, name, original) {
	original.stopPropagation();
	original.preventDefault();
	source.dispatchEvent(new CustomEvent(name, { 
		detail: {
			original
		}
	}));
}

function wrapClick(self, source, name) {
	source.addEventListener('click', e => wrapAndDispatch(self, name, e));
}

export { parseTemplate, applyStyle, initShadow, useDeference, wrapAndDispatch, wrapClick }