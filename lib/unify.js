'use strict';

var forEach    = require('es5-ext/object/for-each')
  , validValue = require('es5-ext/object/valid-value')

  , push = Array.prototype.apply, defineProperty = Object.defineProperty
  , create = Object.create, hasOwnProperty = Object.prototype.hasOwnProperty
  , d = { configurable: true, enumerable: false, writable: true }

module.exports = function (e1, e2) {
	var data;
	(validValue(e1) && validValue(e2));
	if (!e1.hasOwnProperty('__ee__')) {
		if (!e2.hasOwnProperty('__ee__')) {
			d.value = create(null);
			defineProperty(e1, '__ee__', d);
			defineProperty(e2, '__ee__', d);
			d.value = null;
			return;
		}
		d.value = e2.__ee__;
		defineProperty(e1, '__ee__', d);
		d.value = null;
		return;
	}
	data = d.value = e1.__ee__;
	if (!e2.hasOwnProperty('__ee__')) {
		defineProperty(e2, '__ee__', d);
		d.value = null;
		return;
	}
	if (data === e2.__ee__) return;
	forEach(e2.__ee__, function (listener, name) {
		if (!hasOwnProperty.call(data, name)) {
			data[name] = listener;
			return;
		}
		if (data[name].hasOwnProperty('__eecol__')) {
			if (listener.hasOwnProperty('__eecol__')) push.apply(data[name], listener);
			else data[name].push(listener);
		} else if (listener.hasOwnProperty('__eecol__')) {
			listener.unshift(data[name]);
			data[name] = listener;
		} else {
			(data[name] = [data[name], listener]).__eecol__ = true;
		}
	});
	defineProperty(e2, '__ee__', d);
	d.value = null;
};
