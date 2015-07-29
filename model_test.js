'use strict';

var model = require('./model');
var assert = require('assert');
var eq = assert.deepEqual;

(function testTodoData(){
  eq(model.oTodoData.get() instanceof Array, true);
})();

(function testAddItem(){
  var initialLength = model.oTodoData.get().length;
  model.addItem('do stuff');
  eq(model.oTodoData.get().length, initialLength + 1);
})();

module.exports = 'passed!';

