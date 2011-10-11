'use strict';

var copy   = require('es5-ext/lib/List/clone').call
  , slice  = require('es5-ext/lib/List/slice/call')
  , invoke = require('es5-ext/lib/Object/invoke').apply
  , e      = require('es5-ext/lib/Object/descriptors/e')
  , v      = require('es5-ext/lib/Object/descriptors/v')

  , on, once, off, allOff, emit, getMethods, pname;

pname = '- ee -';

on = function (type, listener) {
	if (!this[pname]) {
		Object.defineProperty(this, pname, { value: {}, configurable: true });
	}
	if (!this[pname][type]) {
		this[pname][type] = [];
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
		args = slice(arguments, 1);
	} else {
		emitter = a;
		type = b;
		args = slice(arguments, 2);
	}
	if (this[pname] && this[pname][type]) {
		listeners = copy(this[pname][type]);
		listeners.forEach(emitter ? function (listener) {
			if ((listener[pname + ' listener'] || listener) !== emitter) {
				listener.apply(this, args);
			}
		} : invoke(this, args), this);
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
	return Object.defineProperties(o || {}, getMethods(lExpose, eExpose));
};
exports.getMethods = getMethods;
