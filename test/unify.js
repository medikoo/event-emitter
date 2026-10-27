"use strict";

var ee = require("../");

module.exports = function (t) {
	return {
		"": function (a) {
			var e1 = {}, e2 = {}, e3 = {}, count, count2, count3;

			ee(e1);
			ee(e2);
			ee(e3);

			count = 0;
			count2 = 0;
			count3 = 0;
			e1.on("foo", function () { ++count; });
			e2.on("foo", function () { ++count2; });
			e3.on("foo", function () { ++count3; });

			e1.emit("foo");
			a(count, 1, "Pre unify, x");
			a(count2, 0, "Pre unify, y");
			a(count3, 0, "Pre unify, z");

			t(e1, e2);
			a(e1.__ee__, e2.__ee__, "Post unify y");
			e1.emit("foo");
			a(count, 2, "Post unify, x");
			a(count2, 1, "Post unify, y");
			a(count3, 0, "Post unify, z");

			e2.emit("foo");
			a(count, 3, "Post unify, on y, x");
			a(count2, 2, "Post unify, on y, y");
			a(count3, 0, "Post unify, on y, z");

			t(e1, e3);
			a(e1.__ee__, e1.__ee__, "Post unify z");
			e1.emit("foo");
			a(count, 4, "Post unify z, x");
			a(count2, 3, "Post unify z, y");
			a(count3, 1, "Post unify z, z");
		},
		"On empty": function (a) {
			var e1 = {}, e2 = {}, e3 = {}, count, count2, count3;

			ee(e1);
			ee(e2);
			ee(e3);

			count = 0;
			count2 = 0;
			count3 = 0;
			e2.on("foo", function () { ++count2; });
			e1.emit("foo");
			a(count, 0, "Pre unify, x");
			a(count2, 0, "Pre unify, y");
			a(count3, 0, "Pre unify, z");

			t(e1, e2);
			a(e1.__ee__, e2.__ee__, "Post unify y");
			e1.on("foo", function () { ++count; });
			e1.emit("foo");
			a(count, 1, "Post unify, x");
			a(count2, 1, "Post unify, y");
			a(count3, 0, "Post unify, z");

			e2.emit("foo");
			a(count, 2, "Post unify, on y, x");
			a(count2, 2, "Post unify, on y, y");
			a(count3, 0, "Post unify, on y, z");

			t(e1, e3);
			a(e1.__ee__, e3.__ee__, "Post unify z");
			e3.on("foo", function () { ++count3; });
			e1.emit("foo");
			a(count, 3, "Post unify z, x");
			a(count2, 3, "Post unify z, y");
			a(count3, 1, "Post unify z, z");
		},
		"Many": function (a) {
			var e1 = {}, e2 = {}, e3 = {}, count, count2, count3;

			ee(e1);
			ee(e2);
			ee(e3);

			count = 0;
			count2 = 0;
			count3 = 0;
			e1.on("foo", function () { ++count; });
			e2.on("foo", function () { ++count2; });
			e2.on("foo", function () { ++count2; });
			e3.on("foo", function () { ++count3; });

			e1.emit("foo");
			a(count, 1, "Pre unify, x");
			a(count2, 0, "Pre unify, y");
			a(count3, 0, "Pre unify, z");

			t(e1, e2);
			a(e1.__ee__, e2.__ee__, "Post unify y");
			e1.emit("foo");
			a(count, 2, "Post unify, x");
			a(count2, 2, "Post unify, y");
			a(count3, 0, "Post unify, z");

			e2.emit("foo");
			a(count, 3, "Post unify, on y, x");
			a(count2, 4, "Post unify, on y, y");
			a(count3, 0, "Post unify, on y, z");

			t(e1, e3);
			a(e1.__ee__, e1.__ee__, "Post unify z");
			e1.emit("foo");
			a(count, 4, "Post unify z, x");
			a(count2, 6, "Post unify z, y");
			a(count3, 1, "Post unify z, z");
		},
	};
};
