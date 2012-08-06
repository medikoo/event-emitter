'use strict';

module.exports = function (t, a) {
	var x = {}, count = 0;

	// Basic check
	t(x);
	x.on('foo', function () {
		++count;
	});
	x.emit('foo');

	a(count, 1, "Emitted");

	t.allOff(x);
	x.emit('foo');
	a(count, 1, "All Off");
};
