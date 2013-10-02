'use strict';

var defineProperty = Object.defineProperty
  , aFrom          = require('es5-ext/array/from')
  , remove         = require('es5-ext/array/#/remove')
  , d              = require('d/d')
  , value          = require('es5-ext/object/valid-value')
  , emit           = require('./core').methods.emit

  , id = '- ee -'
  , pipeTag = '\u0001pipes';

module.exports = function (emitter1, emitter2) {
	var pipes, pipe;

	(value(emitter1) && value(emitter2));
	if (!emitter1.emit) {
		throw new TypeError(emitter1 + ' is not emitter');
	}

	pipe = {
		close: function () {
			remove.call(pipes, emitter2);
		}
	};
	if (!emitter1.hasOwnProperty(id)) {
		defineProperty(emitter1, id, d({}));
	}
	if (emitter1[id][pipeTag]) {
		(pipes = emitter1[id][pipeTag]).push(emitter2);
		return pipe;
	}
	pipes = emitter1[id][pipeTag] = [emitter2];
	defineProperty(emitter1, 'emit', d(function () {
		var i, emitter, data = aFrom(pipes);
		emit.apply(this, arguments);
		for (i = 0; (emitter = data[i]); ++i) {
			emit.apply(emitter, arguments);
		}
	}));

	return pipe;
};
