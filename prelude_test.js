'use strict';

var prelude = require('./prelude');
var assert = require('assert');
var eq = assert.deepEqual;

(function testNot(){
	eq(prelude.not(false), true);
	eq(prelude.not(true), false);

        // 0 is falsy
	eq(prelude.not(0), true);
	eq(prelude.not(1), false);

        // [] is not falsy
	eq(prelude.not([]), false);

        // {} is not falsy
	eq(prelude.not([]), false);
})();

(function testLen(){
	eq(prelude.len([]), 0);
	eq([[], [1], [2, 3]].map(prelude.len), [0, 1, 2]);
})();

(function testSinglethon(){
	eq(prelude.singleton(0), [0]);
	eq(prelude.singleton([0]), [[0]]);
})();

module.exports = 'passed!';

