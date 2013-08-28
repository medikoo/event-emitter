'use strict';

var isEmpty = require('es5-ext/object/is-empty')
  , value   = require('es5-ext/object/valid-value')
  , id      = require('./_id');

module.exports = function (obj/*, type*/) {
	var type;
	value(obj);
	type = arguments[1];
	if (arguments.length > 1) {
		return obj.hasOwnProperty(id) && obj[id].hasOwnProperty(type);
	}
	return obj.hasOwnProperty(id) && !isEmpty(obj[id]);
};
