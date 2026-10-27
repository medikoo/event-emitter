"use strict";

var ensureError       = require("es5-ext/error/valid-error")
  , ensureObject      = require("es5-ext/object/valid-object")
  , objHasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = function (err) {
	ensureObject(this);
	ensureError(err);
	if (!objHasOwnProperty.call(this, "__ee__")) throw err;
	if (!this.__ee__.error) throw err;
	this.emit("error", err);
};
