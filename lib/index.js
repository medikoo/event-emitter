'use strict';

var slice       = require('es5-ext/lib/List/slice').call
  , curry       = require('es5-ext/lib/Function/curry')
  , invoke      = require('es5-ext/lib/Object/invoke').apply
  , describeAll = require('es5-ext/lib/Object/describe-all').call;

var ee = {
	on: function (type, listener) {
		if (!this[type]) {
			this[type] = [];
		}
		this[type].push(listener);
	},
	once: function (type, listener) {
		var un = this.un;
		this.on(type, function self () {
			un(type, self);
			return listener.apply(this, arguments);
		});
	},
	un: function (type, listener) {
		var index;
		if (this[type] && ((index = this[type].indexOf(listener)) !== -1)) {
			this[type].splice(index, 1);
		}
	},
	emit: function (listeners, type) {
		var args;
		if (listeners[type]) {
			args = slice(arguments, 2);
			listeners[type].forEach(invoke(this, args));
		}
	}
};

module.exports = function (priv, pub) {
	var listeners = {};
	if (!priv) {
		priv = pub = {};
	} else if (!pub) {
		pub = priv;
	}

	Object.defineProperties(priv, describeAll({
		emit: curry(ee.emit, listeners)
	}));

	Object.defineProperties(pub, describeAll({
		on: ee.on.bind(listeners),
		once: ee.once,
		un: ee.un.bind(listeners)
	}));

	return pub;
};
