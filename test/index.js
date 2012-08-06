'use strict';

module.exports = function (t, a) {
	var x = t(), y, count, count2, test, listener1, listener2;

	x.emit('none');

	test = "Once: ";
	count = 0;
	x.once('foo', function (a1, a2, a3) {
		a(this, x, test + "Context");
		a.deep([a1, a2, a3], ['foo', x, 15], test + "Arguments");
		++count;
	});

	x.emit('foobar');
	a(count, 0, test + "Not invoked on other event");
	x.emit('foo', 'foo', x, 15);
	a(count, 1, test + "Emitted");
	x.emit('foo');
	a(count, 1, test + "Emitted once");

	test = "On & Once: ";
	count = 0;
	x.on('foo', listener1 = function (a1, a2, a3) {
		a(this, x, test + "Context");
		a.deep([a1, a2, a3], ['foo', x, 15], test + "Arguments");
		++count;
	});
	count2 = 0;
	x.once('foo', listener2 = function (a1, a2, a3) {
		a(this, x, test + "Context");
		a.deep([a1, a2, a3], ['foo', x, 15], test + "Arguments");
		++count2;
	});

	x.emit('foobar');
	a(count, 0, test + "Not invoked on other event");
	x.emit('foo', 'foo', x, 15);
	a(count, 1, test + "Emitted");
	x.emit('foo', 'foo', x, 15);
	a(count, 2, test + "Emitted twice");
	a(count2, 1, test + "Emitted once");
	x.off('foo', listener1);
	x.emit('foo');
	a(count, 2, test + "Not emitter after off");

	count = 0;
	x.once('foo', listener1 = function (x, y, z) {
		++count;
	});

	x.off('foo', listener1);
	x.emit('foo');
	a(count, 0, "Once Off: Not emitted");
};
