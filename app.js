require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
// http://www.rajdeepd.com/articles/chrome/localstrg/LocalStorageSample.htm

// NOTE:
// this varies from actual localStorage in some subtle ways

// also, there is no persistence
// TODO persist
(function () {
  "use strict";

  var db;

  function LocalStorage() {
  }
  db = LocalStorage;

  db.prototype.getItem = function (key) {
    if (this.hasOwnProperty(key)) {
      return String(this[key]);
    }
    return null;
  };

  db.prototype.setItem = function (key, val) {
    this[key] = String(val);
  };

  db.prototype.removeItem = function (key) {
    delete this[key];
  };

  db.prototype.clear = function () {
    var self = this;
    Object.keys(self).forEach(function (key) {
      self[key] = undefined;
      delete self[key];
    });
  };

  db.prototype.key = function (i) {
    i = i || 0;
    return Object.keys(this)[i];
  };

  db.prototype.__defineGetter__('length', function () {
    return Object.keys(this).length;
  });

  if (global.localStorage) {
    module.exports = localStorage;
  } else {
    module.exports = new LocalStorage();
  }
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
//
// Observable JS
//

'use strict';

// Publishers and Subscribers share the Observable
// interface, which includes a get() and subscribe()
// function.
function Observable() {
}

Observable.prototype.subscribe = function(f) {
    if (!this.subscribers) {
        this.subscribers = [f];
    } else {
        this.subscribers.push(f);
    }
    return this;
};

function Publisher(v) {
    this.value = v;
}

// Observable values
Publisher.prototype = new Observable();
Publisher.prototype.constructor = Publisher;

Publisher.prototype.set = function(v) {
    this.value = v;
    if (this.subscribers) {
        var me = this;
        this.subscribers.forEach(function(f) {
            f(me);
        });
    }
    return this;
};

Publisher.prototype.get = function() {
    return this.value;
};

// Observable computations.  subscriber() takes a list of observables
// and a callback function and returns an observable.  Any time
// a value is requested AND an input has changed, the given callback
// is executed, and its return value is returned.
function Subscriber(args, f) {
    this.valid = false;
    this.f = f;
    this.oArgs = null;
    this.args = [];

    var me = this;  // Avoid 'this' ambiguity.

    // Handle an observable list of subscribers.
    if (args instanceof Observable) {
        this.oArgs = args;
        args = this.oArgs.get();
        this.oArgs.subscribe(function() {
            // TODO: unsubscribe previous values.
            me.args = [];
            me.oArgs.get().forEach(function(o) {
                me.addArg(o);
            });
            me.invalidate();
        });
    }

    args.forEach(function(o) {
        me.addArg(o);
    });
}

Subscriber.prototype = new Observable();
Subscriber.prototype.constructor = Subscriber;

Subscriber.prototype.addArg = function(o) {
    this.args.push(o);
    var me = this;
    if (o instanceof Observable) {
        o.subscribe(function() {
            me.invalidate();
        });
    }
};

Subscriber.prototype.invalidate = function() {
    if (this.valid) {
        this.valid = false;
        if (this.subscribers) {
            for (var i = 0; i < this.subscribers.length; i++) {
                var f = this.subscribers[i];
                f(this);
            }
        }
    }
};

Subscriber.prototype.get = function() {
    if (this.valid) {
        return this.value;
    } else {
        var vals = this.args.map(function(o) {
            return o instanceof Observable ? o.get() : o;
        });

        var oldValue = this.value;
        this.value = this.f.apply(null, vals);
        this.valid = true;

        if (this.value !== oldValue && this.subscribers) {
            var me = this;
            this.subscribers.forEach(function(f) {
                f(me);
            });
        }

        return this.value;
    }
};

function subscriber(args, f) {
    return new Subscriber(args, f);
}

// o.map(f) is a shorthand for observable.subscriber([o], f)
Observable.prototype.map = function(f) {
    return subscriber([this], f);
};

// Handy function to lift a raw function into the observable realm
function lift(f) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        return subscriber(args, f);
    };
}

// Handy function to capture the current state of an object containing observables
function snapshot(o) {
    if (typeof o === 'object') {
        if (o instanceof Observable) {
            return snapshot(o.get());
        } else {
            if (o instanceof Array) {
                return o.map(snapshot);
            } else {
                var o2 = {};
                var k;
                for (k in o) {
                    o2[k] = snapshot(o[k]);
                }
                return o2;
            }
        }
    } else {
        return o;
    }
}

function publisher(v) {
    return new Publisher(v);
}

module.exports = {
    Observable: Observable,
    Publisher: Publisher,
    publisher: publisher,
    Subscriber: Subscriber,
    subscriber: subscriber,
    lift: lift,
    snapshot: snapshot
};

},{}],"/gizmos.js":[function(require,module,exports){
'use strict';

var dom = require('poochie/dom');

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

function listItem(xs) {
	return container(xs, 'li');
}

module.exports = {
	container: container,
	h1: function(s) { return container([s], 'h1'); },
	link: link,
	listItem: listItem,
	paragraph: function(xs) { return container(xs, 'p'); }
};

},{"poochie/dom":"poochie/dom"}],"/index.js":[function(require,module,exports){
'use strict';

var tododata = require('./tododata');
var todolist = require('./todolist');
var todomisc = require('./todomisc');
var gizmos = require('./gizmos');

var oTodoData = tododata.createObservableTodoData();
tododata.autoSave(oTodoData);

var oFragment = tododata.createObservableFragment();

module.exports = gizmos.container([
	todomisc.todoApp([
		todomisc.header([
			gizmos.h1('todos'),
			todomisc.newTodoItem('What needs to be done?', oTodoData)
		]),
		todomisc.mainSection([
			todomisc.toggleAllCheckbox('Mark all as complete', oTodoData),
			todolist.todoList(oTodoData, oFragment)
		]),
		todomisc.footer([
			todomisc.todoItemsLeft(oTodoData),
			todomisc.filters([
				gizmos.link('#/', 'All', oFragment),
				gizmos.link('#/active', 'Active', oFragment),
				gizmos.link('#/completed', 'Completed', oFragment)
			]),
			todomisc.clearCompletedButton('Clear completed', oTodoData)
		], oTodoData)
	]),
	todomisc.infoFooter([
		gizmos.paragraph(['Double-click to edit a todo']),
		gizmos.paragraph([
			'Created by ',
			gizmos.link('https://github.com/garious', 'Greg Fitzgerald')
		]),
		gizmos.paragraph([
			'May one day be a part of ',
			gizmos.link('http://todomvc.com', 'TodoMVC')
		])
	])
]);

},{"./gizmos":"/gizmos.js","./tododata":"/tododata.js","./todolist":"/todolist.js","./todomisc":"/todomisc.js"}],"/prelude.js":[function(require,module,exports){
'use strict';

function not(val) {
	return !val;
}

function len(xs) {
	return xs.length;
}

function singleton(x) {
	return [x];
}

module.exports = {
	not: not,
	len: len,
	singleton: singleton
};

},{}],"/tododata.js":[function(require,module,exports){
(function (global){
'use strict';

var observable = require('poochie/observable');
var localStorage = require('localStorage');

function createObservableFragment() {
	var oFragment = observable.publisher('/');

	function onHashChange() {
		oFragment.set(global.location.hash.slice(1) || '/');
	}

	if (global.window) {
		global.window.onhashchange = onHashChange;
		onHashChange();
	}

	return oFragment;
}

function observeTodoItemData(data) {
	return {
		text: observable.publisher(data.text),
		completed: observable.publisher(Boolean(data.completed))
	};
}

function addItem(text, oTodoData) {
	var data = oTodoData.get();
	data.push(observeTodoItemData({text: text}));
	oTodoData.set(data);
}

function removeItem(idx, oTodoData) {
	var data = oTodoData.get();
	data.splice(idx, 1);
	oTodoData.set(data);
}

function isObservableFalse(o) {
	return !o.get();
}

function isObservableTrue(o) {
	return o.get();
}

// Return the value of the 'completed' field.
function completedField(item) {
	return item.completed;
}

// Return the value of the 'text' field.
function textField(item) {
	return item.text;
}

// Return an array of only the value of the 'completed' field
// from the input array.
function textFields(data) {
	return data.map(textField);
}

// Return an array of only the value of the 'completed' field
// from the input array.
function completedFields(data) {
	return data.map(completedField);
}

// Return an array of all observables in the todoList.
function observableFields(data) {
	return textFields(data).concat(completedFields(data));
}

// Return an observable array where each item is an observable
// indicating whether the item is complete or not. It is updated
// if an item is marked complete or if the number of items in the
// list changes.
function getIsCompletedFields(oItems) {
	// An observable of observables.
	var oCompletedFields = oItems.map(completedFields);

	// Notified if any of item changes state, or if the total number of items
	// changes.
	return observable.subscriber(oCompletedFields, function() {
		return oCompletedFields.get();
	});
}

// Return the number of observable items that are currently false.
function getFalseCount(items) {
	return items.filter(isObservableFalse).length;
}

// Return the number of observable items that are currently true.
function getTrueCount(items) {
	return items.filter(isObservableTrue).length;
}

// Return an observable containing the number of items left.
function oGetItemsLeftCount(oItems) {
	return getIsCompletedFields(oItems).map(getFalseCount);
}

// Return an observable containing the number of items completed.
function oGetItemsCompletedCount(oItems) {
	return getIsCompletedFields(oItems).map(getTrueCount);
}

function save(oTodoList) {
	var todoList = observable.snapshot(oTodoList);
	var todoData = JSON.stringify(todoList);
	localStorage.setItem('todoData', todoData);
}

function createObservableTodoData() {
	var todoData = localStorage.getItem('todoData');
	var todoList = JSON.parse(todoData) || [];
	return observable.publisher(todoList.map(observeTodoItemData));
}

function autoSave(oTodoList) {
	var oFields = oTodoList.map(observableFields);
	var oTodoFields = observable.subscriber(oFields, function() {
		return oFields.get();
	});
	oTodoFields.invalidate = function() {
		oTodoFields.get();
		save(oTodoList);
	};
}

module.exports = {
	addItem: addItem,
	autoSave: autoSave,
	createObservableFragment: createObservableFragment,
	createObservableTodoData: createObservableTodoData,
	getIsCompletedFields: getIsCompletedFields,
	oGetItemsLeftCount: oGetItemsLeftCount,
	oGetItemsCompletedCount: oGetItemsCompletedCount,
	removeItem: removeItem
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"localStorage":1,"poochie/observable":2}],"/todoitem.js":[function(require,module,exports){
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

},{"./prelude":"/prelude.js","poochie/dom":"poochie/dom","poochie/observable":2}],"/todolist.js":[function(require,module,exports){
'use strict';

var observable = require('poochie/observable');
var gizmos = require('./gizmos');
var tododata = require('./tododata');
var todoitem = require('./todoitem');

function todoList(oTodoData, oFragment) {
	function todoItem(itemData, index) {
		var handlers = {
			remove: function() { tododata.removeItem(index, oTodoData); }
                };

		return todoitem.todoItem({
			text: itemData.text,
			completed: itemData.completed,
			handlers: handlers
		});
	}

	function todoItems(todoData, fragment) {
		if (fragment === '/active') {
			todoData = todoData.filter(function(x){ return !x.completed.get(); });
		} else if (fragment === '/completed') {
			todoData = todoData.filter(function(x){ return x.completed.get(); });
		}
		return todoData.map(todoItem);
	}

	var oIsCompletedFields = tododata.getIsCompletedFields(oTodoData);
	var oItems = observable.subscriber([oTodoData, oFragment, oIsCompletedFields], todoItems);
	return gizmos.container(oItems, 'ul', 'todo-list');
}

module.exports = {
	todoList: todoList
};

},{"./gizmos":"/gizmos.js","./tododata":"/tododata.js","./todoitem":"/todoitem.js","poochie/observable":2}],"/todomisc.js":[function(require,module,exports){
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

},{"./gizmos":"/gizmos.js","./prelude":"/prelude.js","./tododata":"/tododata.js","poochie/dom":"poochie/dom"}],"poochie/dom":[function(require,module,exports){
(function (global){
//
// Module name:
//
//     dom
//
// Description:
//
//     'dom' is a JavaScript module for creating HTML elements.
//     The module exposes two object constructors, 'createElement' and 'element'.
//     The functions accept the same arguments, an HTML tag name, an attributes
//     object, an array of subelements, and an eventHandlers object.  The
//     difference is that 'element' postpones the creation of an underlying DOM
//     element, whereas 'createElement' creates and returns the DOM element.
//
//     createElement(x) === element(x).render()
//
//     By postponing the creation of the DOM, we can unit test modules
//     that return element objects without requiring a browser or a browser
//     simulator such as JsDom or Zombie.  A bare-bones JavaScript interpreter
//     such as Node.js will suffice.
//

'use strict';

var observable = require('./observable');
var intervalTimers = [];

// Add style 's' with value 'style[s]' to the DOM element 'e'.
function addStyle(e, subscriber, style, s) {
    if (style[s] instanceof observable.Observable) {
        e.style[s] = style[s].get();
        var o = style[s].map(function(v) { e.style[s] = v; });
        subscriber.addArg(o);
    } else {
        e.style[s] = style[s];
    }
}

// Add attribute 'k' with value 'v' to the DOM element 'e'.   If the
// attribute's value is 'undefined', it will be ignored.  If the
// attribute's value is an observable, then any time its value is
// 'undefined', the attribute will be removed.
function addAttribute(e, subscriber, k, v) {
    if (v instanceof observable.Observable) {
        var val = v.get();
        if (val !== undefined) {
            e[k] = val;
        }
        var o = v.map(function(v2) {
            if (v2 !== undefined) {
                e[k] = v2;
            } else {
                delete e[k];
            }
        });
        subscriber.addArg(o);
    } else {
        e[k] = v;
    }
}

function setChildren(subscriber, e, xs) {
    e.innerHTML = '';
    for (var i = 0; i < xs.length; i++) {
        var x = render(xs[i]);
        e.appendChild(x);
    }
}

// Create a DOM element with tag name 'nm', attributes object 'as', style object 'sty',
// an array of subelements 'xs', and an object of event handlers 'es'.
function createElementAndSubscriber(ps) {

    // Create DOM node
    var e = global.document.createElement(ps.name);

    // Create a subscriber to watch any observables.
    var subscriber = observable.subscriber([], function() { return e; });

    // Add attributes
    var as = ps.attributes;
    var k;
    if (as) {
        for (k in as) {
            if (k !== 'style' && as[k] !== undefined) {
                addAttribute(e, subscriber, k, as[k]);
            }
        }
    }

    // Add Style
    var style = ps.style;
    if (style) {
        for (var s in style) {
            if (style[s] !== undefined) {
                addStyle(e, subscriber, style, s);
            }
        }
    }

    // Add child elements
    var xs = ps.contents;
    if (xs) {
        if (typeof xs === 'string') {
            e.appendChild(global.document.createTextNode(xs));
        } else {
            if (xs instanceof observable.Observable) {
                var xsObs = xs;
                xs = xsObs.get();
                var o = xsObs.map(function(ys) {
                    setChildren(subscriber, e, ys);
                });
                subscriber.addArg(o);
            }
            setChildren(subscriber, e, xs);
        }
    }

    // Add event handlers
    var es = ps.handlers;
    if (typeof es === 'object') {
        for (k in es) {
            e.addEventListener(k, es[k]);
        }
    }

    if (ps.focus instanceof observable.Observable) {
        subscriber.addArg(ps.focus.map(function setFocus(focus) {
            function onTimeout() {
                if (focus) {
                    e.focus();
                } else {
                    e.blur();
                }
            }

            // Use setTimeout so that focus is set after the DOM has had an
            // opportunity to render other attributes that may have changed,
            // such as style.display.
            setTimeout(onTimeout, 0);
        }));
    }

    return {
        element: e,
        subscriber: subscriber
    };
}

function createElement(ps) {
    if (typeof ps === 'string') {
        ps = {name: ps};
    }

    var obj = createElementAndSubscriber(ps);

    if (obj.subscriber.args.length > 0) {
        var id = setInterval(function() { obj.subscriber.get(); }, 30);
        intervalTimers.push(id);
    }

    return obj.element;
}

//
// clear all interval timers created by createElement()
//
function clearIntervalTimers() {
    for (var i = 0; i < intervalTimers.length; i++) {
        clearInterval(intervalTimers[i]);
    }
}

//
// element({name, attributes, style, contents, handlers})
//
function ReactiveElement(as) {

    if (typeof as === 'string') {
        as = {name: as};
    }

    this.name = as.name;

    if (as.attributes !== undefined) {
        this.attributes = as.attributes;
    }

    if (as.style !== undefined) {
        this.style = as.style;
    }

    if (as.contents !== undefined) {
        this.contents = as.contents;
    }

    if (as.handlers !== undefined) {
        this.handlers = as.handlers;
    }

    if (as.focus instanceof observable.Observable) {
        this.focus = as.focus;
    }
}

ReactiveElement.prototype.render = function() {
    return createElement(this);
};

function element(as) {
    return new ReactiveElement(as);
}

// Render a string or object with a render method, such as a ReactiveElement.
function render(e) {
    if (typeof e === 'string') {
        return global.document.createTextNode(e);
    } else if (typeof e.render === 'function') {
        return render(e.render());
    }
    return e;
}

module.exports = {
    createElement: createElement,
    createElementAndSubscriber: createElementAndSubscriber,
    clearIntervalTimers: clearIntervalTimers,
    ReactiveElement: ReactiveElement,
    element: element,
    render: render
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./observable":2}]},{},[]);
