'use strict';

var defineProperty = Object.defineProperty
  , d              = require('es5-ext/lib/Object/descriptor')
  , value          = require('es5-ext/lib/Object/valid-value')
  , emit           = require('./core').methods.emit;

module.exports = function (emitter1, emitter2) {
	var desc;

	value(emitter1) && value(emitter2);
	if (!emitter1.emit) {
		throw new TypeError(emitter + ' is not emitter');
	}

	defineProperty(emitter1, 'emit', d(function () {
		emit.apply(this, arguments);
		emit.apply(emitter2, arguments);
	}));
};
