'use strict';

var dom = require('poochie/dom');
var observable = require('poochie/observable');
var model = require('./model');
var prelude = require('./prelude');
var todoitem = require('./view_todoitem');

var ENTER_KEY = 13;

function displayStyle(val) {
	return val ? 'block' : 'none';
}

function container(contents, name, className) {
	var params = {name: name || 'div', contents: contents};
	if (className) {
		params.attributes = {className: className};
	}
	return dom.element(params);
}

function link(href, text, oFragment) {
	var oClass;
	if (oFragment !== undefined) {
		oClass = oFragment.map(function(fragment) {
			return href === ('#' + fragment) ? 'selected' : '';
		});
	}
	return dom.element({
		name: 'a',
		attributes: {className: oClass, href: href},
		contents: [text]
	});
}

function toggleCheckbox(text, oTodoData) {
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
			checked: model.oGetItemsLeftCount(oTodoData).map(prelude.not)
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
	return model.oGetItemsLeftCount(oItems).map(todoItemsLeftContents);
}

function todoItemsLeft(oTodoData) {
	return container(oTodoItemsLeftContents(oTodoData), 'span', 'todo-count');
}

function newTodoItem(placeholderText, oTodoData) {
	function onKeyUp(evt) {
		var value = evt.target.value.trim();
		if (evt.keyCode === ENTER_KEY && value) {
			model.addItem(value, oTodoData);
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

function todoList(oTodoData, oFragment) {
	function todoItem(itemData, index) {
		var handlers = {
			remove: function() { model.removeItem(index, oTodoData); }
                };
		return todoitem.todoItem(itemData, handlers);
	}

	function todoItems(todoData, fragment) {
		if (fragment === '/active') {
			todoData = todoData.filter(function(x){ return !x.completed.get(); });
		} else if (fragment === '/completed') {
			todoData = todoData.filter(function(x){ return x.completed.get(); });
		}
		return todoData.map(todoItem);
	}

	var oIsCompletedFields = model.getIsCompletedFields(oTodoData);
	var oItems = observable.subscriber([oTodoData, oFragment, oIsCompletedFields], todoItems);
	return container(oItems, 'ul', 'todo-list');
}

function listItem(xs) {
	return container(xs, 'li');
}

function clearButton(s, oTodoData) {
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
			visibility: model.oGetItemsCompletedCount(oTodoData).map(visibleAttr)
		},
		handlers: {
			click: onClick
		}
	});
}

function todoFooter(xs, oTodoData) {
	return dom.element({
		name: 'footer',
		attributes: {className: 'footer'},
		style: {display: oTodoData.map(prelude.len).map(displayStyle)},
		contents: xs
	});
}

module.exports = {
	clearButton: clearButton,
	container: container,
	h1: function(s) { return container([s], 'h1'); },
	infoFooter: function(xs) { return container(xs, 'footer', 'info'); },
	link: link,
	listItem: listItem,
	mainSection: function(xs) { return container(xs, 'section', 'main'); },
	newTodoItem: newTodoItem,
	paragraph: function(xs) { return container(xs, 'p'); },
	todoFilters: function(xs) { return container(xs.map(prelude.singleton).map(listItem), 'ul', 'filters'); },
	todoFooter: todoFooter,
	todoHeader: function(xs) { return container(xs, 'header', 'header'); },
	todoItemsLeft: todoItemsLeft,
	todoList: todoList,
	todoSection: function(xs) { return container(xs, 'section', 'todoapp'); },
	toggleCheckbox: toggleCheckbox
};
