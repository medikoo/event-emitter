'use strict';

var value = require('es5-ext/lib/Object/valid-value')
  , emit  = require('./core').methods.emit;

module.exports = function (emitter1, emitter2) {
	value(emitter1) && value(emitter2);

	emitter1.emit = function () {
		emit.apply(this, arguments);
		emit.apply(emitter2, arguments);
	};
};
