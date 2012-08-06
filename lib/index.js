'use strict';

var slice            = Array.prototype.slice
  , defineProperty   = Object.defineProperty
  , defineProperties = Object.defineProperties
  , copy             = require('es5-ext/lib/Array/prototype/copy')
  , d                = require('es5-ext/lib/Object/descriptor')
  , callable         = require('es5-ext/lib/Object/valid-callable')

  , on, once, off, allOff, emit, id, methods, descriptors;

id = '- ee -';

on = function (type, listener) {
	type = String(type);
	callable(listener);

	if (!this.hasOwnProperty(id)) {
		defineProperty(this, id, d({}));
	}
	if (!this[id].hasOwnProperty(type)) {
		(this[id][type] = []).copy = copy;
	}
	this[id][type].push(listener);
	return this;
};

once = function (type, listener) {
	type = String(type);
	callable(listener);

	var offt = off.bind(this), nlistener;
	if (!this.hasOwnProperty(id + ' once')) {
		defineProperty(this, id + ' once', d({}));
	}
	if (!this[id + ' once'].hasOwnProperty(type)) {
		this[id + ' once'][type] = [[], []];
	}
	nlistener = function nlistener() {
		offt(type, listener);
		listener.apply(this, arguments);
	};
	this[id + ' once'][type][0]
		.push(nlistener[id + ' listener'] = listener);
	this[id + ' once'][type][1].push(nlistener);
	return on.call(this, type, nlistener);
};

off = function (type, listener) {
	type = String(type);
	callable(listener);

	var index, ls = this.hasOwnProperty(id) &&
		this[id].hasOwnProperty(type) && this[id][type];
	if (ls && ((index = ls.indexOf(listener)) !== -1)) {
		ls.splice(index, 1);
	}
	ls = this.hasOwnProperty(id + ' once') &&
		this[id + ' once'].hasOwnProperty(type) && this[id + ' once'][type];
	if (ls && ((index = ls[0].indexOf(listener)) !== -1)) {
		ls[0].splice(index, 1);
		off.call(this, type, ls[1][index]);
		ls[1].splice(index, 1);
	}
	return this;
};

allOff = function () {
	delete this[id];
	delete this[id + ' once'];
};

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
	if (this.hasOwnProperty(id) && this[id].hasOwnProperty(type)) {
		listeners = this[id][type].copy();
		listeners.forEach(emitter ? function (listener) {
			if ((listener[id + ' listener'] || listener) !== emitter) {
				listener.apply(this, args);
			}
		} : function (listener) {
			listener.apply(this, args);
		}.bind(this), this);
	}
	return this;
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit,
	allOff: allOff
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit),
	allOff: d(allOff)
};

module.exports = exports = function (o) {
	return defineProperties(Object(o), descriptors);
};
exports.methods = methods;
