'use strict';

var slice            = Array.prototype.slice
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , copy             = require('es5-ext/lib/Array/prototype/copy')
  , d                = require('es5-ext/lib/Object/descriptor')
  , callable         = require('es5-ext/lib/Object/valid-callable')

  , on, once, off, allOff, emit, getMethods, pname;

pname = '- ee -';

on = function (type, listener) {
	type = String(type);
	callable(listener);

	if (!this[pname]) {
		defineProperty(this, pname, d('c', {}));
	}
	if (!this[pname].hasOwnProperty(type)) {
		this[pname][type] = defineProperty([], 'copy', d(copy));
	}
	this[pname][type].push(listener);
	return this;
};

once = function (type, listener) {
	type = String(type);
	callable(listener);

	var offt = off.bind(this), nlistener;
	if (!this[pname + ' once']) {
		defineProperty(this, pname + ' once', d('c', {}));
	}
	if (!this[pname + ' once'].hasOwnProperty(type)) {
		this[pname + ' once'][type] = [[], []];
	}
	nlistener = function nlistener() {
		offt(type, listener);
		listener.apply(this, arguments);
	};
	this[pname + ' once'][type][0]
		.push(nlistener[pname + ' listener'] = listener);
	this[pname + ' once'][type][1].push(nlistener);
	return on.call(this, type, nlistener);
};

off = function (type, listener) {
	type = String(type);
	callable(listener);

	var index, ls = this[pname] && this[pname].hasOwnProperty(type) &&
		this[pname][type];
	if (ls && ((index = ls.indexOf(listener)) !== -1)) {
		ls.splice(index, 1);
	}
	ls = this[pname + ' once'] && this[pname + ' once'].hasOwnProperty(type) &&
		this[pname + ' once'][type];
	if (ls && ((index = ls[0].indexOf(listener)) !== -1)) {
		ls[0].splice(index, 1);
		off.call(this, type, ls[1][index]);
		ls[1].splice(index, 1);
	}
	return this;
};

allOff = d('', function () {
	delete this[pname];
	delete this[pname + ' once'];
});

emit = function (a, b) {
	var args, emitter, type, listeners;
	if (typeof a === 'string') {
		emitter = null;
		type = a;
		args = slice.call(arguments, 1);
	} else {
		emitter = a;
		type = b;
		args = slice.call(arguments, 2);
	}
	if (this[pname] && this[pname].hasOwnProperty(type)) {
		listeners = this[pname][type].copy();
		listeners.forEach(emitter ? function (listener) {
			if ((listener[pname + ' listener'] || listener) !== emitter) {
				listener.apply(this, args);
			}
		} : function (listener) {
			listener.apply(this, args);
		}.bind(this), this);
	}
	return this;
};

getMethods = (function () {
	var hidden, exposed, lExposed, eExposed;

	hidden = {
		on: d('', on),
		once: d('', once),
		off: d('', off),
		emit:  d('', emit),
		allOff: allOff
	};

	exposed = {
		on: d('e', on),
		once: d('e', once),
		off: d('e', off),
		emit:  d('e', emit),
		allOff: allOff
	};

	lExposed = {
		on: d('e', on),
		once: d('e', once),
		off: d('e', off),
		emit:  d('', emit),
		allOff: allOff
	};

	eExposed = {
		on: d('', on),
		once: d('', once),
		off: d('', off),
		emit:  d('e', emit),
		allOff: allOff
	};

	return function (l, e) {
		if (l) {
			if (e) {
				return exposed;
			} else {
				return lExposed;
			}
		} else if (e) {
			return eExposed;
		} else {
			return hidden;
		}
	};
}());

module.exports = exports = function (o, lExpose, eExpose) {
	return defineProperties(o || {}, getMethods(lExpose, eExpose));
};
exports.getMethods = getMethods;
