"use strict";

var customError = require("es5-ext/error/custom")
  , ee          = require("../");

module.exports = function (t, a) {
	var emitter, error = customError("Some error", "ERROR_TEST"), emitted;

	emitter = ee();
	a.throws(function () { t.call(emitter, error); }, "ERROR_TEST");
	emitter.on("error", function (err) { emitted = err; });
	t.call(emitter, error);
	a(emitted, error);
};
