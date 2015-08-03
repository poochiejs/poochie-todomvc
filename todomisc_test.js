'use strict';

var todomisc = require('./todomisc');
var assert = require('assert');
var observable = require('poochie/observable');
var pub = observable.publisher;
var eq = assert.deepEqual;

// Test todoItemsLeft.
(function(){
	function itemsLeft(oItems) {
		var span = todomisc.todoItemsLeft(oItems);
		var cnts = span.contents.get();
		return cnts[0].contents[0] + cnts[1];
	}
	var oTodoData = pub([]);
	eq(itemsLeft(oTodoData), '0 items left');

	// Add an item to the todo list and verify the contents changes.
	oTodoData.set([{completed: pub(false)}]);
	eq(itemsLeft(oTodoData), '1 item left');
})();

// Test newTodoItem.
(function(){
	var oTodoData = pub([]);
	var item = todomisc.newTodoItem('baz', oTodoData);

	// Verify the handler is not called.
	item.handlers.keyup({keyCode: 10, target: {value: 'bar'}});
	eq(oTodoData.get().length, 0);

	// Verify the handler is called.
	item.handlers.keyup({keyCode: 13, target: {value: 'bar'}});
	eq(oTodoData.get().length, 1);

	// Verify trim both sides.
	item.handlers.keyup({keyCode: 13, target: {value: '  bar	'}});
	eq(oTodoData.get()[0].text.get(), 'bar');

	// Verify empty trimmed string ignored.
	item.handlers.keyup({keyCode: 13, target: {value: '  '}});
	eq(oTodoData.get()[0].text.get(), 'bar');
})();

// Test marking all items complete.
(function(){
	var oTodoData = pub([{text: pub('a'), completed: pub(false)}]);
	var checkbox = todomisc.toggleAllCheckbox('foo', oTodoData);

	// Test checkbox is displayed when more than one item is in the todo list.
	eq(checkbox.style.display.get(), 'block');

	// Test checking 'true' sets all items to complete.
	checkbox.handlers.click({target: {checked: true}});
	eq(oTodoData.get()[0].completed.get(), true);

	// Test checking 'false' sets all items to incomplete.
	checkbox.handlers.click({target: {checked: false}});
	eq(oTodoData.get()[0].completed.get(), false);

	// Value may be true/false/undefined. Check that it's converted to a Boolean.
	checkbox.handlers.click({target: {}});
	eq(oTodoData.get()[0].completed.get(), false);

	// Test that checking all items causes the toggleAllCheckbox to be checked.
	oTodoData.get()[0].completed.set(true);
	eq(checkbox.attributes.checked.get(), true);

})();

// Test clear completed button.
(function(){
	var oTodoData = pub([
		{text: pub('a'), completed: pub(true)},
		{text: pub('b'), completed: pub(false)},
		{text: pub('c'), completed: pub(true)}
	]);
	var button = todomisc.clearCompletedButton('foo', oTodoData);
	eq(button.style.visibility.get(), 'visible');

	button.handlers.click();
	eq(oTodoData.get()[0].text.get(), 'b');
	eq(button.style.visibility.get(), 'hidden');
})();

// Test footer is not visible if there are no todo items.
(function(){
	var footer = todomisc.footer([], pub([]));
	eq(footer.style.display.get(), 'none');
})();

module.exports = 'passed!';

