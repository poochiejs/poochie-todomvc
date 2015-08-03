'use strict';

var dom = require('poochie/dom');
var tododata = require('./tododata');
var prelude = require('./prelude');
var gizmos = require('./gizmos');

var ENTER_KEY = 13;

function displayStyle(val) {
	return val ? 'block' : 'none';
}

function toggleAllCheckbox(text, oTodoData) {
	function onClick(evt) {
		oTodoData.get().forEach(function(item) {
			item.completed.set(Boolean(evt.target.checked));
		});
	}

	return dom.element({
		name: 'input',
		attributes: {
			className: 'toggle-all',
			type: 'checkbox',
			checked: tododata.oGetItemsLeftCount(oTodoData).map(prelude.not)
		},
		style: {display: oTodoData.map(prelude.len).map(displayStyle)},
		handlers: {
			click: onClick
		}
	});
}

function todoItemsLeftContents(itemsLeft) {
	return [
		dom.element({name: 'strong', contents: [String(itemsLeft)]}),
		' item' + (itemsLeft === 1 ? '' : 's') + ' left'
	];
}

function oTodoItemsLeftContents(oItems) {
	return tododata.oGetItemsLeftCount(oItems).map(todoItemsLeftContents);
}

function todoItemsLeft(oTodoData) {
	return gizmos.container(oTodoItemsLeftContents(oTodoData), 'span', 'todo-count');
}

function newTodoItem(placeholderText, oTodoData) {
	function onKeyUp(evt) {
		var value = evt.target.value.trim();
		if (evt.keyCode === ENTER_KEY && value) {
			tododata.addItem(value, oTodoData);
			evt.target.value = '';
		}
	}
	return dom.element({
		name: 'input',
		attributes: {
			className: 'new-todo',
			placeholder: placeholderText,
			autofocus: true
		},
		handlers: {
			keyup: onKeyUp
		}
	});
}

function clearCompletedButton(s, oTodoData) {
	function onClick() {
		// Iterate over the list backward and remove items
		// by index when completed.
		var todoData = oTodoData.get();
		var item;
		for (var i = todoData.length - 1; i >= 0; i--) {
			item = todoData[i];
			if (item.completed.get()) {
				todoData.splice(i, 1);
			}
		}
		oTodoData.set(todoData);
	}

	function visibleAttr(itemsComplete) {
		return itemsComplete > 0 ? 'visible' : 'hidden';
	}

	return dom.element({
		name: 'button',
		contents: [s],
		attributes: {className: 'clear-completed'},
		style: {
			visibility: tododata.oGetItemsCompletedCount(oTodoData).map(visibleAttr)
		},
		handlers: {
			click: onClick
		}
	});
}

function footer(xs, oTodoData) {
	return dom.element({
		name: 'footer',
		attributes: {className: 'footer'},
		style: {display: oTodoData.map(prelude.len).map(displayStyle)},
		contents: xs
	});
}

function filters(xs) {
	var contents = xs.map(prelude.singleton).map(gizmos.listItem);
	return gizmos.container(contents, 'ul', 'filters');
}

module.exports = {
	clearCompletedButton: clearCompletedButton,
	infoFooter: function(xs) { return gizmos.container(xs, 'footer', 'info'); },
	mainSection: function(xs) { return gizmos.container(xs, 'section', 'main'); },
	newTodoItem: newTodoItem,
	filters: filters,
	footer: footer,
	header: function(xs) { return gizmos.container(xs, 'header', 'header'); },
	todoItemsLeft: todoItemsLeft,
	todoApp: function(xs) { return gizmos.container(xs, 'section', 'todoapp'); },
	toggleAllCheckbox: toggleAllCheckbox
};
