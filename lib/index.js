'use strict';

var slice       = require('es5-ext/lib/List/slice').call
  , invoke      = require('es5-ext/lib/Object/invoke').apply
  , describeAll = require('es5-ext/lib/Object/to-descriptors').call

  , ee, emit;

ee = describeAll({
	on: function (type, listener) {
		if (!this.ee) {
			Object.defineProperty(this, 'ee', { value: {}, configurable: true });
		}
		if (!this.ee[type]) {
			this.ee[type] = [];
		}
		this.ee[type].push(listener);
		return this;
	},
	once: function (type, listener) {
		var un = this.off.bind(this);
		return this.on(type, function self () {
			un(type, self);
			listener.apply(this, arguments);
		});
	},
	off: function (type, listener) {
		var index, ls = this.ee && this.ee[type];
		if (ls && ((index = ls.indexOf(listener)) !== -1)) {
			ls.splice(index, 1);
		}
		return this;
	},
	allOff: function () {
		delete this.ee;
	},
	emit: function (emitter, type) {
		var args;
		if (typeof emitter === 'string') {
			type = emitter;
			args = slice(arguments, 1);
			emitter = null;
		} else {
			args = slice(arguments, 2);
		}
		if (this.ee && this.ee[type]) {
			this.ee[type].forEach(emitter ? function (listener) {
				if (listener !== emitter) {
					listener.call(this, args);
				}
			} : invoke(this, args));
		}
		return this;
	}
});

module.exports = function (o) {
	return Object.defineProperties(o || {}, ee);
};
