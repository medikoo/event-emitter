'use strict';

var slice       = require('es5-ext/lib/List/slice').call
  , invoke      = require('es5-ext/lib/Object/invoke').apply
  , describeAll = require('es5-ext/lib/Object/to-descriptors').call

  , ee, emit;

ee = describeAll({
	on: function (type, listener) {
		if (!this.ee) {
			this.ee = {};
		}
		if (!this.ee[type]) {
			this.ee[type] = [];
		}
		this.ee[type].push(listener);
	},
	once: function (type, listener) {
		var un = this.un.bind(this);
		this.on(type, function self () {
			un(type, self);
			listener.apply(this, arguments);
		});
	},
	un: function (type, listener) {
		var index, ls = this.ee && this.ee[type];
		if (ls && ((index = ls.indexOf(listener)) !== -1)) {
			ls.splice(index, 1);
		}
	},
	emit: function (type) {
		if (this.ee && this.ee[type]) {
			this.ee[type].forEach(invoke(this, slice(arguments, 1)));
		}
	}
});

module.exports = function (o) {
	if (!o) {
		o = {};
	}

	return Object.defineProperties(o, ee);
};
