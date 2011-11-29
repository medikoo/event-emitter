'use strict';

var slice            = Array.prototype.slice
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , copy             = require('es5-ext/lib/Array/prototype/copy')
  , c                = require('es5-ext/lib/Object/descriptors/c')
  , e                = require('es5-ext/lib/Object/descriptors/e')
  , v                = require('es5-ext/lib/Object/descriptors/v')

  , on, once, off, allOff, emit, getMethods, pname;

pname = '- ee -';

on = function (type, listener) {
	if (!this[pname]) {
		defineProperty(this, pname, c({}));
	}
	if (!this[pname][type]) {
		this[pname][type] = defineProperty([], 'copy', v(copy));
	}
	this[pname][type].push(listener);
	return this;
};

once = function (type, listener) {
	var offt = off.bind(this), nlistener;
	nlistener = function nlistener () {
		offt(type, nlistener);
		listener.apply(this, arguments);
	};
	nlistener[pname + ' listener'] = listener;
	return on.call(this, type, nlistener);
};

off = function (type, listener) {
	var index, ls = this[pname] && this[pname][type];
	if (ls && ((index = ls.indexOf(listener)) !== -1)) {
		ls.splice(index, 1);
	}
	return this;
};

allOff = v(function () {
	delete this[pname];
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
	if (this[pname] && this[pname][type]) {
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
		on: v(on), once: v(once), off: v(off),
		emit:  v(emit),
		allOff: allOff
	};

	exposed = {
		on: e(on), once: e(once), off: e(off),
		emit:  e(emit),
		allOff: allOff
	};

	lExposed = {
		on: e(on), once: e(once), off: e(off),
		emit:  v(emit),
		allOff: allOff
	};

	eExposed = {
		on: v(on), once: v(once), off: v(off),
		emit:  e(emit),
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
