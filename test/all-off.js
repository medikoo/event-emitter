"use strict";

var ee = require("../");

module.exports = function (t, a) {
	var emitter, count, count2;

	emitter = ee();
	count = 0;
	count2 = 0;
	emitter.on("foo", function () { ++count; });
	emitter.on("foo", function () { ++count; });
	emitter.on("bar", function () { ++count2; });
	emitter.on("bar", function () { ++count2; });
	t(emitter, "foo");
	emitter.emit("foo");
	emitter.emit("bar");
	a(count, 0, "All off: type");
	a(count2, 2, "All off: ohter type");

	count = 0;
	count2 = 0;
	emitter.on("foo", function () { ++count; });
	emitter.on("foo", function () { ++count; });
	emitter.on("bar", function () { ++count2; });
	emitter.on("bar", function () { ++count2; });
	t(emitter);
	emitter.emit("foo");
	emitter.emit("bar");
	a(count, 0, "All off: type");
	a(count2, 0, "All off: other type");
};
