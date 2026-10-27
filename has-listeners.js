"use strict";

var isEmpty           = require("es5-ext/object/is-empty")
  , value             = require("es5-ext/object/valid-value")
  , objHasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function (obj/*, type*/) {
	var type;
	value(obj);
	type = arguments[1];
	if (arguments.length > 1) {
		return objHasOwnProperty.call(obj, "__ee__") && Boolean(obj.__ee__[type]);
	}
	return objHasOwnProperty.call(obj, "__ee__") && !isEmpty(obj.__ee__);
};
