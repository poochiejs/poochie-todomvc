'use strict';

var gizmos = require('./gizmos');
var assert = require('assert');
var observable = require('poochie/observable');
var pub = observable.publisher;
var eq = assert.deepEqual;

// Test link event handlers.
(function(){
	var oFragment = pub('foo');
	var link = gizmos.link('#a.b.c', 'A', oFragment);
	eq(link.attributes.className.get(), '');

	oFragment.set('a.b.c');
	eq(link.attributes.className.get(), 'selected');

	oFragment.set('bar');
	eq(link.attributes.className.get(), '');
})();

module.exports = 'passed!';

