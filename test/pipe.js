"use strict";

var ee = require("../");

module.exports = function (t, a) {
	var e1 = {}, e2 = {}, e3 = {}, count, count2, count3, pipe;

	ee(e1);
	e1 = Object.create(e1);
	ee(e2);
	ee(e3);

	count = 0;
	count2 = 0;
	count3 = 0;
	e1.on("foo", function () { ++count; });
	e2.on("foo", function () { ++count2; });
	e3.on("foo", function () { ++count3; });

	e1.emit("foo");
	a(count, 1, "Pre pipe, x");
	a(count2, 0, "Pre pipe, y");
	a(count3, 0, "Pre pipe, z");

	pipe = t(e1, e2);
	e1.emit("foo");
	a(count, 2, "Post pipe, x");
	a(count2, 1, "Post pipe, y");
	a(count3, 0, "Post pipe, z");

	e2.emit("foo");
	a(count, 2, "Post pipe, on y, x");
	a(count2, 2, "Post pipe, on y, y");
	a(count3, 0, "Post pipe, on y, z");

	t(e1, e3);
	e1.emit("foo");
	a(count, 3, "Post pipe z, x");
	a(count2, 3, "Post pipe z, y");
	a(count3, 1, "Post pipe z, z");

	pipe.close();
	e1.emit("foo");
	a(count, 4, "Close pipe y, x");
	a(count2, 3, "Close pipe y, y");
	a(count3, 2, "Close pipe y, z");
};
