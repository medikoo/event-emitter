'use strict';

// Benchmark comparing performance of event emit for single listener
// To run it, do following in memoizee package path:
//
// $ npm install bench eventemitter2 signals
// $ node benchmark/single-on.js

var ee, native, ee2, signals;

ee = (function () {
	var ee = require('../lib/core');
	return ee().on('test', function () { return arguments; });
}());

native = (function () {
	var ee = require('events');
	return (new ee.EventEmitter()).on('test', function () { return arguments; });
}());

ee2 = (function () {
	var ee = require('eventemitter2');
	return (new ee.EventEmitter2()).on('test', function () { return arguments; });
}());

signals = (function () {
	var Signal = require('signals')
	  , ee = { test: new Signal() };
	ee.test.add(function () { return arguments; });
	return ee;
}());

var a = {}, b = {};

exports.compare = {
	"event-emitter (this)": function () {
		ee.emit('test', a, b);
	},
	"EventEmitter (Node's native)": function () {
		native.emit('test', a, b);
	},
	"EventEmitter2": function () {
		ee2.emit('test', a, b);
	},
	"Signals": function () {
		signals.test.dispatch(a, b);
	}
};

require('bench').runMain();
