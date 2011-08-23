'use strict';

var slice  = require('es5-ext/lib/List/slice').call
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
	var off = off.bind(this);
	return on.call(this, type, function self () {
		off(type, self);
		listener.apply(this, arguments);
	});
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

emit = function (emitter, type) {
	var args;
	if (typeof emitter === 'string') {
		type = emitter;
		args = slice(arguments, 1);
		emitter = null;
	} else {
		args = slice(arguments, 2);
	}
	if (this[pname] && this[pname][type]) {
		this[pname][type].forEach(emitter ? function (listener) {
			if (listener !== emitter) {
				listener.call(this, args);
			}
		} : invoke(this, args));
	}
	return this;
};

getMethods = (function () {
	var hidden, exposed, lExposed, eExposed;

	hidden = {
		on: v(on), once: v(once), off: v(off),
		emit:  v(emit),
		alOff: allOff
	};

	exposed = {
		on: e(on), once: e(once), off: e(off),
		emit:  e(emit),
		alOff: allOff
	};

	lExposed = {
		on: e(on), once: e(once), off: e(off),
		emit:  v(emit),
		alOff: allOff
	};

	eExposed = {
		on: v(on), once: v(once), off: v(off),
		emit:  e(emit),
		alOff: allOff
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
