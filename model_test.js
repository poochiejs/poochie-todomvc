'use strict';

var model = require('./model');
var observable = require('poochie/observable');
var assert = require('assert');
var localStorage = require('localStorage');
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

(function testLocalStorage(){
  var rawTodoData = [
    {text: 'Taste JavaScript', completed: true},
    {text: 'Buy a unicorn'}
  ];

  localStorage.clear();
  localStorage.setItem('todoData', JSON.stringify(rawTodoData));

  var oTodoData = model.createObservableTodoData();
  eq(oTodoData.get()[1].text.get(), 'Buy a unicorn');
})();

(function testAutoSave(){
  function load() {
    return JSON.parse(localStorage.getItem('todoData'));
  }

  var rawTodoData = [
    {text: 'Taste JavaScript', completed: true},
    {text: 'Buy a unicorn'}
  ];

  localStorage.clear();
  localStorage.setItem('todoData', JSON.stringify(rawTodoData));
  var oTodoData = model.createObservableTodoData();
  model.autoSave(oTodoData);

  // Modify completed state. Ensure it was saved.
  eq(load()[0].completed, true);
  oTodoData.get()[0].completed.set(false);
  eq(load()[0].completed, false);

  // Modify item text. Ensure it was saved.
  oTodoData.get()[0].text.set('Taste localStorage');
  eq(load()[0].text, 'Taste localStorage');

  // Push an item. Ensure it was saved.
  var todoData = oTodoData.get();
  todoData.push({text: pub('More stuff')});
  oTodoData.set(todoData);
  eq(load()[2].text, 'More stuff');
})();

(function testFragment(){
  model.createObservableFragment();
})();

(function testFragmentWithWindow(){
  global.window = {};

  // Test empty URL.
  global.location = {hash: ''};
  model.createObservableFragment();

  // Test URL with a fragment.
  global.location = {hash: '#/'};
  model.createObservableFragment();

  delete global.location;
  delete global.window;
})();

module.exports = 'passed!';

