'use strict';

var defineProperty = Object.defineProperty
  , d              = require('es5-ext/lib/Object/descriptor')
  , value          = require('es5-ext/lib/Object/valid-value')
  , emit           = require('./core').methods.emit

  , id = '- ee -'
  , pipeTag = '\u0001pipes';

module.exports = function (emitter1, emitter2) {
	var desc;

	value(emitter1) && value(emitter2);
	if (!emitter1.emit) {
		throw new TypeError(emitter + ' is not emitter');
	}

	if (!emitter1.hasOwnProperty(id)) {
		defineProperty(emitter1, id, d({}));
	}
	if (emitter1[id][pipeTag]) {
		emitter1[id][pipeTag].push(emitter2);
		return;
	}
	emitter1[id][pipeTag] = [emitter2];
	defineProperty(emitter1, 'emit', d(function () {
		var i, emitter, data;
		emit.apply(this, arguments);
		for (i = 0, data = this[id][pipeTag]; emitter = data[i]; ++i) {
			emit.apply(emitter, arguments);
		}
	}));
};
