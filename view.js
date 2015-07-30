'use strict';

var dom = require('poochie/dom');
var observable = require('poochie/observable');
var model = require('./model');

var ENTER_KEY = 13;

function not(val) {
  return !val;
}

function len(xs) {
  return xs.length;
}

function checkedAttr(val) {
  return val ? true : undefined;
}

function displayStyle(val) {
  return val ? 'block' : 'none';
}

function container(contents, name, className) {
  var params = {name: name || 'div', contents: contents};
  if (className) {
    params.attributes = {'class': className};
  }
  return dom.element(params);
}

function link(href, text) {
  var oClass = observable.publisher(undefined);
  return dom.element({
    name: 'a',
    attributes: {'class': oClass, href: href},
    contents: [text],
    handlers: {
      select: function() { oClass.set('selected'); },
      blur: function() { oClass.set(undefined); }
    }
  });
}

function toggleCheckbox(text, oTodoData) {
  function onClick(evt) {
    oTodoData.get().forEach(function(item) {
      item.completed.set(evt.target.checked);
    });
  }

  var toggleAllLabel = dom.element({
    name: 'label',
    attributes: {'for': 'toggle-all'},
    contents: [text]
  });

  return dom.element({
    name: 'div',
    contents: [
      dom.element({
        name: 'input',
        attributes: {'class': 'toggle-all', type: 'checkbox'},
        style: {display: oTodoData.map(len).map(displayStyle)},
        handlers: {
          click: onClick
        }
      }),
      toggleAllLabel
    ]
  });
}

function isObservableFalse(o) {
  return !o.get();
}

function isObservableTrue(o) {
  return o.get();
}

function todoItemsLeftContents(items) {
  var itemsLeft = items.filter(isObservableFalse).length;
  return [
     dom.element({name: 'strong', contents: [String(itemsLeft)]}),
     ' item' + (itemsLeft === 1 ? '' : 's') + ' left'
  ];
}

function completedField(item) {
  return item.completed;
}

function completedFields(data) {
  return data.map(completedField);
}

function oTodoItemsLeftContents(oItems) {
  // An observable of observables.
  var oCompletedFields = oItems.map(completedFields);

  // Notified if any of item changes state, or if the total number of items
  // changes.
  var oCompletedTodoData = observable.subscriber(oCompletedFields, function() {
    return oCompletedFields.get();
  });
  return oCompletedTodoData.map(todoItemsLeftContents);
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
      'class': 'new-todo',
      placeholder: placeholderText,
      autofocus: true
    },
    handlers: {
      keyup: onKeyUp
    }
  });
}

function readModeTodoItem(attrs) {
  return dom.element({
    name: 'div',
    attributes: {'class': 'view'},
    style: {'display': attrs.readMode.map(displayStyle)},
    handlers: {
      'dblclick': function onDblClick() { attrs.readMode.set(false); }
    },
    contents: [
      dom.element({
        name: 'label',
        contents: attrs.text.map(function(x) { return [x]; })
      }),
      dom.element({
        name: 'button',
        attributes: {'class': 'destroy'},
        handlers: {
          'click': function() { model.removeItem(attrs.index, attrs.oTodoData); }
        }
      })
    ]
  });
}

function writeModeTodoItem(attrs) {
  return dom.element({
    name: 'input',
    attributes: {'class': 'edit', value: attrs.text},
    style: {'display': attrs.readMode.map(not).map(displayStyle)},
    handlers: {
      'change': function onChange(evt) {
        var value = evt.target.value.trim();
        if (value === '') {
          model.removeItem(attrs.index, attrs.oTodoData);
        } else {
          attrs.text.set(value);
        }
        attrs.readMode.set(true);
      }
    }
  });
}

function completedClass(val) {
  return val ? 'completed' : '';
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
    attributes: {'class': itemAttrs.completed.map(completedClass)},
    contents: [
      dom.element({
        name: 'input',
        attributes: {
          'class': 'toggle',
          type: 'checkbox',
          checked: itemAttrs.completed.map(checkedAttr)
        },
        handlers: {
          click: function(evt) { itemAttrs.completed.set(evt.target.checked); }
        }
      }),
      readModeTodoItem(itemAttrs),
      writeModeTodoItem(itemAttrs)
    ]
  });
}

function todoList(oTodoData) {
  function todoItems(todoData) {
    return todoData.map(todoItem.bind(null, oTodoData));
  }
  var oItems = oTodoData.map(todoItems);
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

  function visibleAttr(items) {
    var itemsComplete = items.filter(isObservableTrue).length;
    return itemsComplete > 0 ? 'visible' : 'hidden';
  }

  // An observable of observables.
  var oCompletedFields = oTodoData.map(completedFields);

  // Notified if any of item changes state, or if the total number of items
  // changes.
  var oCompletedTodoData = observable.subscriber(oCompletedFields, function() {
    return oCompletedFields.get();
  });

  return dom.element({
    name: 'button',
    contents: [s],
    attributes: {'class': 'clear-completed'},
    style: {visibility: oCompletedTodoData.map(visibleAttr)},
    handlers: {
      click: onClick
    }
  });
}

function todoFooter(xs, oTodoData) {
  return dom.element({
    name: 'footer',
    attributes: {'class': 'footer'},
    style: {display: oTodoData.map(len).map(displayStyle)},
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
  todoFilters: function(xs) { return container(xs.map(listItem), 'ul', 'filters'); },
  todoFooter: todoFooter,
  todoHeader: function(xs) { return container(xs, 'header', 'header'); },
  todoItem: todoItem,
  todoItemsLeft: todoItemsLeft,
  todoItemsLeftContents: todoItemsLeftContents,
  todoList: todoList,
  todoSection: function(xs) { return container(xs, 'section', 'todoapp'); },
  toggleCheckbox: toggleCheckbox,
  readModeTodoItem: readModeTodoItem,
  writeModeTodoItem: writeModeTodoItem
};
