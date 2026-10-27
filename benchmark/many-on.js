/* eslint-env node */
/* eslint no-console: "off" */

"use strict";

// Benchmark comparing performance of event emit for many listeners
// To run it, do following in memoizee package path:
//
// $ npm install eventemitter2 signals
// $ node benchmark/many-on.js

var forEach = require("es5-ext/object/for-each")
  , pad     = require("es5-ext/string/#/pad")
  , now     = Date.now
  , time
  , count   = 1000000
  , i
  , data    = {}
  , ee
  , native
  , ee2
  , signals
  , obj1    = {}
  , obj2    = {};

ee = (function () {
	var emitter = require("../")();
	emitter.on("test", function () { return arguments; });
	emitter.on("test", function () { return arguments; });
	return emitter.on("test", function () { return arguments; });
})();

native = (function () {
	var EventEmitter = require("events").EventEmitter;
	var emitter = new EventEmitter();
	emitter.on("test", function () { return arguments; });
	emitter.on("test", function () { return arguments; });
	return emitter.on("test", function () { return arguments; });
})();

ee2 = (function () {
	var EventEmitter2 = require("eventemitter2").EventEmitter2;
	var emitter = new EventEmitter2();
	emitter.on("test", function () { return arguments; });
	emitter.on("test", function () { return arguments; });
	return emitter.on("test", function () { return arguments; });
})();

signals = (function () {
	var Signal  = require("signals")
	  , emitter = { test: new Signal() };
	emitter.test.add(function () { return arguments; });
	emitter.test.add(function () { return arguments; });
	emitter.test.add(function () { return arguments; });
	return emitter;
})();

console.log("Emit for 3 listeners", "x" + count + ":\n");

i = count;
time = now();
while (i--) {
	ee.emit("test", obj1, obj2);
}
data["event-emitter (this implementation)"] = now() - time;

i = count;
time = now();
while (i--) {
	native.emit("test", obj1, obj2);
}
data["EventEmitter (Node.js native)"] = now() - time;

i = count;
time = now();
while (i--) {
	ee2.emit("test", obj1, obj2);
}
data.EventEmitter2 = now() - time;

i = count;
time = now();
while (i--) {
	signals.test.dispatch(obj1, obj2);
}
data.Signals = now() - time;

forEach(
	data,
	function (value, name, obj, index) {
		console.log(index + 1 + ":", pad.call(value, " ", 5), name);
	},
	null,
	function (name1, name2) { return this[name1] - this[name2]; }
);
