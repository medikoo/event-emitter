"use strict";

var noop = require("es5-ext/function/noop");

module.exports = function (t, a) {
	var e1 = t(), e2, count, count2, count3, count4, test, listener1, listener2;

	e1.emit("none");

	test = "Once: ";
	count = 0;
	e1.once("foo", function (a1, a2, a3) {
		a(this, e1, test + "Context");
		a.deep([a1, a2, a3], ["foo", e1, 15], test + "Arguments");
		++count;
	});

	e1.emit("foobar");
	a(count, 0, test + "Not invoked on other event");
	e1.emit("foo", "foo", e1, 15);
	a(count, 1, test + "Emitted");
	e1.emit("foo");
	a(count, 1, test + "Emitted once");

	e2 = t();
	count = 0;
	e2.on("foo", function nested() {
		e2.off("foo", nested);
		e2.emit("foo", "nested");
	});
	e2.once("foo", function (value) {
		a(this, e2, "Reentrant once: Context");
		a(value, "nested", "Reentrant once: Arguments from first invocation");
		++count;
	});
	e2.emit("foo", "outer");
	a(count, 1, "Reentrant once: Invoked only once");

	test = "On & Once: ";
	count = 0;
	e1.on(
		"foo",
		(listener1 = function (a1, a2, a3) {
			a(this, e1, test + "Context");
			a.deep([a1, a2, a3], ["foo", e1, 15], test + "Arguments");
			++count;
		})
	);
	count2 = 0;
	e1.once(
		"foo",
		(listener2 = function (a1, a2, a3) {
			a(this, e1, test + "Context");
			a.deep([a1, a2, a3], ["foo", e1, 15], test + "Arguments");
			++count2;
		})
	);

	e1.emit("foobar");
	a(count, 0, test + "Not invoked on other event");
	e1.emit("foo", "foo", e1, 15);
	a(count, 1, test + "Emitted");
	e1.emit("foo", "foo", e1, 15);
	a(count, 2, test + "Emitted twice");
	a(count2, 1, test + "Emitted once");
	e1.off("foo", listener1);
	e1.emit("foo");
	a(count, 2, test + "Not emitter after off");

	count = 0;
	e1.once("foo", (listener1 = function () { ++count; }));

	e1.off("foo", listener1);
	e1.emit("foo");
	a(count, 0, "Once Off: Not emitted");

	count = 0;
	e1.on("foo", (listener2 = noop));
	e1.once("foo", (listener1 = function () { ++count; }));

	e1.off("foo", listener1);
	e1.emit("foo");
	a(count, 0, "Once Off (multi): Not emitted");
	e1.off("foo", listener2);

	test = "Prototype Share: ";

	e2 = Object.create(e1);

	count = 0;
	count2 = 0;
	count3 = 0;
	count4 = 0;
	e1.on("foo", function () { ++count; });
	e2.on("foo", function () { ++count2; });
	e1.once("foo", function () { ++count3; });
	e2.once("foo", function () { ++count4; });
	e1.emit("foo");
	a(count, 1, test + "x on count");
	a(count2, 0, test + "y on count");
	a(count3, 1, test + "x once count");
	a(count4, 0, test + "y once count");

	e2.emit("foo");
	a(count, 1, test + "x on count");
	a(count2, 1, test + "y on count");
	a(count3, 1, test + "x once count");
	a(count4, 1, test + "y once count");

	e1.emit("foo");
	a(count, 2, test + "x on count");
	a(count2, 1, test + "y on count");
	a(count3, 1, test + "x once count");
	a(count4, 1, test + "y once count");

	e2.emit("foo");
	a(count, 2, test + "x on count");
	a(count2, 2, test + "y on count");
	a(count3, 1, test + "x once count");
	a(count4, 1, test + "y once count");

	test = "Listeners mutation during emit: ";
	e2 = t();
	count = 0;
	count2 = 0;
	count3 = 0;
	count4 = 0;
	e2.on(
		"foo",
		(listener1 = function () {
			++count;
			e2.off("foo", listener1);
			e2.on("foo", function () { ++count4; });
		})
	);
	e2.on("foo", function () { ++count2; });
	e2.on("foo", function () { ++count3; });
	e2.emit("foo");
	a(count, 1, test + "first listener invoked");
	a(count2, 1, test + "second listener not skipped after removal");
	a(count3, 1, test + "third listener invoked");
	a(count4, 0, test + "newly added listener not invoked");
};
