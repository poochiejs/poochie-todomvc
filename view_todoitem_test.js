'use strict';

var view = require('./view_todoitem');
var assert = require('assert');
var observable = require('poochie/observable');
var pub = observable.publisher;
var eq = assert.deepEqual;

// Test double-clicking todo items.
(function(){
	var todo = view.todoItem(pub([]), {
		text: pub('foo'),
		completed: pub(false)
	});
	var readModeTodo = todo.contents[0];
	var writeModeTodo = todo.contents[1];

	// Ensure label contents is a list, not a string.
	eq(readModeTodo.contents[1].contents.get(), ['foo']);

	// Test initial state.
	eq(todo.attributes.className.get(), '');

	// Test state after double-clicking.
	readModeTodo.handlers.dblclick();
	eq(todo.attributes.className.get(), 'editing');

	// Test state after changing the text.
	writeModeTodo.handlers.change({target: {value: 'bar'}});
	eq(todo.attributes.className.get(), '');

	// Test that hitting escape reverts the value of the input element.
	writeModeTodo.handlers.keyup({keyCode: 27, target: {value: 'foo'}});
	eq(writeModeTodo.attributes.value.get(), 'bar');

	// Test that a non-escape key has no effect.
	writeModeTodo.handlers.keyup({keyCode: 42, target: {value: 'foo'}});

})();

// Test marking item as complete.
(function(){
	var todo = view.todoItem(pub([]), {
		text: pub('a'),
		completed: pub(false)
	});

	// Test initial state.
	var checkbox = todo.contents[0].contents[0];
	eq(checkbox.attributes.checked.get(), false);

	// Test state after clicking.
	checkbox.handlers.click({target: {checked: true}});
	eq(checkbox.attributes.checked.get(), true);

	// Test state after clicking again.
	checkbox.handlers.click({target: {checked: false}});
	eq(checkbox.attributes.checked.get(), false);
})();

// Test todoItem className attribute.
(function(){
	var todo = view.todoItem(pub([]), {text: pub('a'), completed: pub(false)});
	eq(todo.attributes.className.get(), '');

	var todo2 = view.todoItem(pub([]), {text: pub('a'), completed: pub(true)});
	eq(todo2.attributes.className.get(), 'completed');
})();

//// Test removeItem.
(function(){
	var oTodoData = pub([{text: pub('a'), completed: pub(false)}]);
	var todo = view.todoItem(oTodoData, oTodoData.get()[0]);
	var readModeTodo = todo.contents[0];
	var destroyButton = readModeTodo.contents[2];

	eq(oTodoData.get().length, 1);

	destroyButton.handlers.click();
	eq(oTodoData.get().length, 0);
})();

// Test removeItem by editing.
(function(){
	var oTodoData = pub([{text: pub('a'), completed: pub(false)}]);
	var todo = view.todoItem(oTodoData, oTodoData.get()[0]);
	var readModeTodo = todo.contents[0];
	var writeModeTodo = todo.contents[1];

	// Ensure nothing happens if in read-mode.
	writeModeTodo.handlers.change({target: {value: ''}});
	eq(writeModeTodo.focus.get(), false);
	eq(oTodoData.get().length, 1);

	// Enter write mode.
	readModeTodo.handlers.dblclick();
	eq(writeModeTodo.focus.get(), true);

	// Ensure empty trimmed string causes item to be removed.
	writeModeTodo.handlers.change({target: {value: '	 '}});
	eq(oTodoData.get().length, 0);
})();

module.exports = 'passed!';

