'use strict';

module.exports = function (t, a) {
	var x = {}, count;

	// Basic check
	count = 0;
	t(x);
	x.on('foo', function () {
		++count;
	});
	x.emit('foo');

	a(count, 1, "Emitted");
};
