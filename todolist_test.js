'use strict';

var todolist = require('./todolist');
var assert = require('assert');
var observable = require('poochie/observable');
var pub = observable.publisher;
var eq = assert.deepEqual;

(function testTodoList(){
	var oTodoData = pub([]);
	var oFragment = pub('/');
	var todoList = todolist.todoList(oTodoData, oFragment);
	oTodoData.set([{text: pub('a'), completed: pub(false)}]);

	// Test 1 item in all.
	oFragment.set('/');
	eq(todoList.contents.get().length, 1);

	// Test 1 item is active.
	oFragment.set('/active');
	eq(todoList.contents.get().length, 1);

	// Test 0 items are completed.
	oFragment.set('/completed');
	eq(todoList.contents.get().length, 0);

	// Test that todoList updates if an item is marked completed.
	oTodoData.get()[0].completed.set(true);
	eq(todoList.contents.get().length, 1);

	// Test removing an item.
	var removeButton = todoList.contents.get()[0];
	removeButton.handlers.remove();
	eq(todoList.contents.get().length, 0);
})();

module.exports = 'passed!';

