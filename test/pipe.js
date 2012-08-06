'use strict';

var ee = require('../lib/core');

module.exports = function (t, a) {
	var x = {}, y = {}, count, count2;

	ee(x);
	ee(y);

	count = 0;
	count2 = 0;
	x.on('foo', function () {
		++count;
	});
	y.on('foo', function () {
		++count2;
	});

	x.emit('foo');
	a(count, 1, "Pre pipe, x");
	a(count2, 0, "Pre pipe, y");

	t(x, y);
	x.emit('foo');
	a(count, 2, "Post pipe, x");
	a(count2, 1, "Post pipe, y");

	y.emit('foo');
	a(count, 2, "Post pipe, on y, x");
	a(count2, 2, "Post pipe, on y, y");

	x.emit('foo');
	a(count, 3, "Post pipe, again x, x");
	a(count2, 3, "Post pipe, again x, y");
};
