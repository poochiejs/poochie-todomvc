'use strict';

var view = require('./view');
var assert = require('assert');
var observable = require('poochie/observable');
var pub = observable.publisher;

// Test link event handlers.
(function(){
  var link = view.link('a.b.c', 'A');
  assert.equal(link.attributes.class.get(), undefined);

  link.handlers.select();
  assert.equal(link.attributes.class.get(), 'selected');

  link.handlers.blur();
  assert.equal(link.attributes.class.get(), undefined);
})();

// Test double-clicking todo items.
(function(){
  var todo = view.todoItem({
    text: pub('foo'),
    completed: pub(false)
  });
  var readModeTodo = todo.contents[0];
  var writeModeTodo = todo.contents[1];

  // Ensure label contents is a list, not a string.
  assert.deepEqual(readModeTodo.contents[1].contents.get(), ['foo']);

  // Test intial state.
  assert.equal(readModeTodo.style.display.get(), 'block');
  assert.equal(writeModeTodo.style.display.get(), 'none');

  // Test state after double-clicking.
  readModeTodo.handlers.dblclick();
  assert.equal(readModeTodo.style.display.get(), 'none');
  assert.equal(writeModeTodo.style.display.get(), 'block');

  // Test state after changing the text.
  writeModeTodo.handlers.change({target: {value: 'bar'}});
  assert.equal(readModeTodo.style.display.get(), 'block');
  assert.equal(writeModeTodo.style.display.get(), 'none');
})();

// Test marking item as complete.
(function(){
  var todo = view.todoItem({
    text: pub('a'),
    completed: pub(false)
  });
  var readModeTodo = todo.contents[0];

  // Test initial state.
  var checkbox = readModeTodo.contents[0];
  assert.equal(checkbox.attributes.checked.get(), undefined);

  // Test state after clicking.
  checkbox.handlers.click();
  assert.equal(checkbox.attributes.checked.get(), true);

  // Test state after clicking again.
  checkbox.handlers.click();
  assert.equal(checkbox.attributes.checked.get(), undefined);
})();

// Test todoItem class attribute.
(function(){
  var todo = view.todoItem({text: pub('a'), completed: pub(false)});
  assert.equal(todo.attributes.class.get(), '');

  var todo2 = view.todoItem({text: pub('a'), completed: pub(true)});
  assert.equal(todo2.attributes.class.get(), 'completed');
})();

module.exports = 'passed!';

