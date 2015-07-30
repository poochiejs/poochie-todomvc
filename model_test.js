'use strict';

var model = require('./model');
var observable = require('poochie/observable');
var assert = require('assert');
var pub = observable.publisher;
var eq = assert.deepEqual;

(function testTodoData(){
  eq(model.createObservableTodoData().get() instanceof Array, true);
})();

(function testAddItem(){
  var oTodoData = pub([]);
  model.addItem('do stuff', oTodoData);
  eq(oTodoData.get().length, 1);
})();

(function testRemoveItem(){
  var oTodoData = pub([{text: 'foo'}, {text: 'bar'}]);

  model.removeItem(0, oTodoData);
  eq(oTodoData.get().length, 1);

  model.removeItem(0, oTodoData);
  eq(oTodoData.get().length, 0);
})();

module.exports = 'passed!';

