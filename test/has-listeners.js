"use strict";

var noop = require("es5-ext/function/noop")
  , ee   = require("../");

module.exports = function (t) {
	var emitter, listener;
	return {
		Any: function (a) {
			a(t(true), false, "Primitive");
			a(t({ events: [] }), false, "Other object");
			a(t((emitter = ee())), false, "Emitter: empty");

			emitter.on("test", (listener = noop));
			a(t(emitter), true, "Emitter: full");
			emitter.off("test", listener);
			a(t(emitter), false, "Emitter: empty but touched");
			emitter.once("test", (listener = noop));
			a(t(emitter), true, "Emitter: full: Once");
			emitter.off("test", listener);
			a(t(emitter), false, "Emitter: empty but touched by once");
		},
		Specific: function (a) {
			a(t(true, "test"), false, "Primitive");
			a(t({ events: [] }, "test"), false, "Other object");
			a(t((emitter = ee()), "test"), false, "Emitter: empty");

			emitter.on("test", (listener = noop));
			a(t(emitter, "test"), true, "Emitter: full");
			a(t(emitter, "foo"), false, "Emitter: full, other event");
			emitter.off("test", listener);
			a(t(emitter, "test"), false, "Emitter: empty but touched");
			a(t(emitter, "foo"), false, "Emitter: empty but touched, other event");

			emitter.once("test", (listener = noop));
			a(t(emitter, "test"), true, "Emitter: full: Once");
			a(t(emitter, "foo"), false, "Emitter: full: Once,  other event");
			emitter.off("test", listener);
			a(t(emitter, "test"), false, "Emitter: empty but touched by once");
			a(t(emitter, "foo"), false, "Emitter: empty but touched by once, other event");
		},
	};
};
