'use strict';

module.exports = function (t, a) {
	var o = Object.create(t({}))
	  , removed = false, listener, count = 0;

	a(o.propertyIsEnumerable('on'), false, "Properties not enumerable");
	o.on('test', function (x, y, z) {
		if (count == 1) {
			a(x + y + z, 7, "Emitted");
		} else if (count == 2) {
			a(x + y + z, 11, "Emitted second time");
		}
	});
	o.on('test', listener = function (x, y, z) {
		if (count === 1) {
			a(x + y + z, 7, "Emitted second listener");
		} else {
			a.never("Removed listener");
		}
	});

	o.on('other-test', function (x, y, z) {
		if (count === 1) {
			a(x + y + z, 5, "Other event");
		}
	});

	o.once('test', function (x, y, z) {
		if (count == 1) {
			a(x + y + z, 7, "Once");
		} else {
			a.never("Once run once");
		}
	});

	++count;
	o.emit({}, 'test', 1, 2, 4);
	o.emit({}, 'other-test', 1, 3, 1);
	o.off('test', listener);
	++count;
	o.emit('test', 1, 7, 3);

	count = 0;
	o.once('off-mid', function () {
		++count;
	});
	o.on('off-mid', listener = function () {
		++count;
	});
	o.on('off-mid', listener = function () {
		++count;
	});
	o.emit('off-mid');
	a(count, 3, "Run all listeners");

};
