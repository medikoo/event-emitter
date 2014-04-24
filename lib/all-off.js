'use strict';

var value = require('es5-ext/object/valid-value');

module.exports = function (emitter) {
	var type, data;

	value(emitter);

	if (arguments[1] != null) {
		type = arguments[1];
		data = emitter.hasOwnProperty('__ee__') && emitter.__ee__;
		if (!data) {
			return;
		}
		if (data.hasOwnProperty(type)) {
			delete data[type];
		}
	} else if (emitter.hasOwnProperty('__ee__')) {
		delete emitter.__ee__;
	}
};
