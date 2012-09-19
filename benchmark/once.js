'use strict';

// Benchmark comparing performance of registration and event emit for once
// listener
// To run it, do following in memoizee package path:
//
// $ npm install bench eventemitter2 signals
// $ node benchmark/single-on.js

var ee, native, ee2, signals;

ee = (function () {
	var ee = require('../lib/core');
	return ee();
}());

native = (function () {
	var ee = require('events');
	return (new ee.EventEmitter());
}());

ee2 = (function () {
	var ee = require('eventemitter2');
	return (new ee.EventEmitter2());
}());

signals = (function () {
	var Signal = require('signals');
	return { test: new Signal() };
}());

var a = {}, b = {};

exports.compare = {
	"event-emitter (this)": function () {
		ee.once('test', function () { return arguments; });
		ee.emit('test', a, b);
	},
	"EventEmitter (Node's native)": function () {
		native.once('test', function () { return arguments; });
		native.emit('test', a, b);
	},
	"EventEmitter2": function () {
		ee2.once('test', function () { return arguments; });
		ee2.emit('test', a, b);
	},
	"Signals": function () {
		signals.test.addOnce(function () { return arguments; });
		signals.test.dispatch(a, b);
	}
};

require('bench').runMain();
