# Event emitter

Basic event emitter for Node.js and Browsers

## Installation

Node & npm:

	$ npm install event-emitter

## Usage

	var ee = require('event-emitter');

	var MyCostructor = function () {};
	ee(MyConstructor.prototype);

	var myObj = new MyConstructor();

	// Register listener:
	var listener;
	myObj.on('name', listener = function (args) {
		 // ... whatever
	});

	// Register listener that would be removed after first emit:
	myObj.once('name', function (args) {
		// ... whatever
	});

	// Remove registered listener
	myObj.off('name', listener);

	// Emit event
	myObj.emit('name', arg1/*, arg2, arg3*/);
