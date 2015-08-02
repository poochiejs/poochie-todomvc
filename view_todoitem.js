'use strict';

var dom = require('poochie/dom');
var observable = require('poochie/observable');
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

function readModeTodoItem(attrs, handlers) {
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
					'click': handlers.remove
				}
			})
		]
	});
}

function writeModeTodoItem(attrs, handlers) {
	function onChange(evt) {
		if (attrs.readMode.get()) {
			return;
		}
		var value = evt.target.value.trim();
		if (value === '') {
			handlers.remove(evt);
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

function todoItemImpl(params) {
	var attr = {
		text: params.attributes.text,
		completed: params.attributes.completed,
		readMode: observable.publisher(true)
	};

	var handlers = {};
	handlers.remove = params.handlers && params.handlers.remove || function() {};

	return dom.element({
		name: 'li',
		attributes: {
			className: observable.subscriber([attr.completed, attr.readMode], todoItemClass)
		},
		contents: [
			readModeTodoItem(attr, handlers),
			writeModeTodoItem(attr, handlers)
		]
	});
}

function todoItem(params) {
	var e = {attributes: params.attributes, handlers: params.handlers};
	e.render = function() { return todoItemImpl(e).render(); };
	return e;
}


module.exports = {
	todoItem: todoItem,
	todoItemImpl: todoItemImpl
};
