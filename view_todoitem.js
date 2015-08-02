'use strict';

var dom = require('poochie/dom');
var observable = require('poochie/observable');
var model = require('./model');
var prelude = require('./prelude');

var ESC_KEY = 27;

function todoItemClass(completed, readMode) {
	var classes = [];
	if (completed) {
		classes.push('completed');
	}
	if (!readMode) {
		classes.push('editing');
	}
	return classes.join(' ');
}

function readModeTodoItem(attrs) {
	return dom.element({
		name: 'div',
		attributes: {className: 'view'},
		handlers: {
			'dblclick': function onDblClick() { attrs.readMode.set(false); }
		},
		contents: [
			dom.element({
				name: 'input',
				attributes: {
					className: 'toggle',
					type: 'checkbox',
					checked: attrs.completed
				},
				handlers: {
					click: function(evt) { attrs.completed.set(evt.target.checked); }
				}
			}),
			dom.element({
				name: 'label',
				contents: attrs.text.map(prelude.singleton)
			}),
			dom.element({
				name: 'button',
				attributes: {className: 'destroy'},
				handlers: {
					'click': function() { model.removeItem(attrs.index, attrs.oTodoData); }
				}
			})
		]
	});
}

function writeModeTodoItem(attrs) {
	function onChange(evt) {
		if (attrs.readMode.get()) {
			return;
		}
		var value = evt.target.value.trim();
		if (value === '') {
			model.removeItem(attrs.index, attrs.oTodoData);
		} else {
			attrs.text.set(value);
		}
		attrs.readMode.set(true);
	}
	function onKeyUp(evt) {
		if (evt.keyCode === ESC_KEY) {
			evt.target.value = attrs.text.get();
			attrs.readMode.set(true);
		}
	}
	return dom.element({
		name: 'input',
		focus: attrs.readMode.map(prelude.not),
		attributes: {className: 'edit', value: attrs.text},
		handlers: {
			'change': onChange,
			'blur': onChange,
			'keyup': onKeyUp
		}
	});
}

function todoItem(oTodoData, attrs, index) {
	var itemAttrs = {
		index: index,
		oTodoData: oTodoData,
		text: attrs.text,
		completed: attrs.completed,
		readMode: observable.publisher(true)
	};

	return dom.element({
		name: 'li',
		attributes: {
			className: observable.subscriber([itemAttrs.completed, itemAttrs.readMode], todoItemClass)
		},
		contents: [
			readModeTodoItem(itemAttrs),
			writeModeTodoItem(itemAttrs)
		]
	});
}

module.exports = {
	todoItem: todoItem
};
