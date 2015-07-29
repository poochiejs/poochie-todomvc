'use strict';

var model = require('./model');
var assert = require('assert');
var eq = assert.deepEqual;

(function(){
  eq(model.oTodoData.get() instanceof Array, true);
})();

module.exports = 'passed!';

