'use strict';

var defineProperty = Object.defineProperty
  , aFrom          = require('es5-ext/array/from')
  , remove         = require('es5-ext/array/#/remove')
  , d              = require('d')
  , value          = require('es5-ext/object/valid-object')
  , emit           = require('./core').methods.emit

  , hasOwnProperty = Object.prototype.hasOwnProperty
  , getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

module.exports = function (e1, e2) {
	var pipes, pipe, desc;

	(value(e1) && value(e2));
	if (typeof e1.emit !== 'function') {
		throw new TypeError(e1 + ' is not emitter');
	}

	pipe = {
		close: function () { remove.call(pipes, e2); }
	};
	if (hasOwnProperty.call(e1, '__eePipes__')) {
		(pipes = e1.__eePipes__).push(e2);
		return pipe;
	}
	defineProperty(e1, '__eePipes__', d(pipes = [e2]));
	desc = getOwnPropertyDescriptor(e1, 'emit');
	delete desc.get;
	delete desc.set;
	desc.value = function () {
		var i, emitter, data = aFrom(pipes);
		emit.apply(this, arguments);
		for (i = 0; (emitter = data[i]); ++i) emit.apply(emitter, arguments);
	};
	defineProperty(e1, 'emit', desc);
	return pipe;
};
