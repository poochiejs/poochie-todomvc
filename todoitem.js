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

function readModeTodoItem(params) {
	return dom.element({
		name: 'div',
		attributes: {className: 'view'},
		handlers: {
			'dblclick': function onDblClick() { params.readMode.set(false); }
		},
		contents: [
			dom.element({
				name: 'input',
				attributes: {
					className: 'toggle',
					type: 'checkbox',
					checked: params.completed
				},
				handlers: {
					click: function(evt) { params.completed.set(evt.target.checked); }
				}
			}),
			dom.element({
				name: 'label',
				contents: params.text.map(prelude.singleton)
			}),
			dom.element({
				name: 'button',
				attributes: {className: 'destroy'},
				handlers: {
					'click': params.handlers.remove
				}
			})
		]
	});
}

function writeModeTodoItem(params) {
	function onChange(evt) {
		if (params.readMode.get()) {
			return;
		}
		var value = evt.target.value.trim();
		if (value === '') {
			params.handlers.remove(evt);
		} else {
			params.text.set(value);
		}
		params.readMode.set(true);
	}
	function onKeyUp(evt) {
		if (evt.keyCode === ESC_KEY) {
			evt.target.value = params.text.get();
			params.readMode.set(true);
		}
	}
	return dom.element({
		name: 'input',
		focus: params.readMode.map(prelude.not),
		attributes: {className: 'edit', value: params.text},
		handlers: {
			'change': onChange,
			'blur': onChange,
			'keyup': onKeyUp
		}
	});
}

function todoItemImpl(params) {
	var handlers = {};
	handlers.remove = params.handlers && params.handlers.remove || function() {};

	var ps = {
		text: params.text,
		completed: params.completed,
		readMode: observable.publisher(true),
                handlers: handlers
	};

	return dom.element({
		name: 'li',
		attributes: {
			className: observable.subscriber([ps.completed, ps.readMode], todoItemClass)
		},
		contents: [
			readModeTodoItem(ps),
			writeModeTodoItem(ps)
		]
	});
}

function todoItem(params) {
	var e = {text: params.text, completed: params.completed, handlers: params.handlers};
	e.render = function() { return todoItemImpl(e); };
	return e;
}


module.exports = {
	todoItem: todoItem,
	todoItemImpl: todoItemImpl
};
