'use strict';

var isArray          = Array.isArray
  , create           = Object.create
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , copy             = require('es5-ext/lib/Array/prototype/copy')
  , ktrue            = require('es5-ext/lib/Function/k')(true)
  , d                = require('es5-ext/lib/Object/descriptor')
  , callable         = require('es5-ext/lib/Object/valid-callable')

  , on, once, off, emit
  , id, onceTag, pipeTag
  , methods, descriptors, base;

id = '- ee v0.2 -';
onceTag = '\u0001once';

on = function (type, listener) {
	var data;

	callable(listener);

	if (!this.hasOwnProperty(id)) {
		defineProperty(this, id, d(data = {}));
	} else {
		data = this[id];
	}
	if (!data.hasOwnProperty(type)) {
		data[type] = listener;
	} else if (isArray(data[type])) {
		data[type].push(listener);
	} else {
		(data[type] = [data[type], listener]).copy = copy;
	}

	return this;
};

once = function (type, listener) {
	var onceListener, data, index;

	on.call(this, type, listener);

	data = this[id];
	index = isArray(data[type]) ? (data[type].length - 1) : 0;
	type = type + onceTag;
	if (!data.hasOwnProperty(type)) {
		data[type] = [];
	}
	data[type][index] = true;

	return this;
};

off = function (type, listener) {
	var data, listeners, index;

	callable(listener);

	data = this.hasOwnProperty(id) && this[id];
	if (!data) {
		return this;
	}
	listeners = data.hasOwnProperty(type) && data[type];
	if (!listeners) {
		return this;
	}

	if (isArray(listeners)) {
		if ((index = listeners.indexOf(listener)) !== -1) {
			listeners.splice(index, 1);
			if (!listeners.length) {
				delete data[type];
				delete data[type + onceTag];
			} else {
				type = type + onceTag;
				if (data.hasOwnProperty(type)) {
					data[type].splice(index, 1);
					if (!data[type].length || !data[type].some(ktrue)) {
						delete data[type];
					}
				}
			}
		}
	} else if (listeners === listener) {
		delete data[type];
		delete data[type + onceTag];
	}

	return this;
};

emit = function (type) {
	var data, i, l, listener, listeners, count, args, emitter;

	data = this.hasOwnProperty(id) && this[id];
	if (!data) {
		return;
	}

	listeners = data.hasOwnProperty(type) && data[type];
	if (!listeners) {
		return;
	}

	if (typeof listeners === 'function') {
		if (data.hasOwnProperty(type + onceTag)) {
			delete data[type];
			delete data[type + onceTag];
		}
		switch (arguments.length) {
			// fast cases
		case 1:
			listeners.call(this);
			break;
		case 2:
			listeners.call(this, arguments[1]);
			break;
		case 3:
			listeners.call(this, arguments[1], arguments[2]);
			break;
			// slower
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; i++) args[i - 1] = arguments[i];
			listeners.apply(this, args);
		}
	} else {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) {
			args[i - 1] = arguments[i];
		}

		listeners = listeners.copy();
		if (data.hasOwnProperty(type + onceTag)) {
			count = 0;
			data[type + onceTag].forEach(function (listener, index) {
				data[type].splice(index - count++, 1);
			});
			delete data[type + onceTag];
			if (!data[type].length) {
				delete data[type];
			}
		}

		for (i = 0; listener = listeners[i]; ++i) {
			listener.apply(this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;
