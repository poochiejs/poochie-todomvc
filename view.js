'use strict';

var dom = require('poochie/dom');
var observable = require('poochie/observable');

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

function toggleCheckbox(text) {
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
        attributes: {'class': 'toggle-all', type: 'checkbox'}
      }),
      toggleAllLabel
    ]
  });
}

function isObservableFalse(o) {
  return !o.get();
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

function newTodoItem(placeholderText) {
  return dom.element({
    name: 'input',
    attributes: {
      'class': 'new-todo',
      placeholder: placeholderText,
      autofocus: true
    }
  });
}

function checkedAttr(val) {
  return val ? true : undefined;
}

function displayStyle(val) {
  return val ? 'block' : 'none';
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
        name: 'input',
        attributes: {
          'class': 'toggle',
          type: 'checkbox',
          checked: attrs.completed.map(checkedAttr)
        },
        handlers: {
          'click': function() { attrs.completed.set(!attrs.completed.get()); }
        }
      }),
      dom.element({
        name: 'label',
        contents: attrs.text.map(function(x) { return [x]; })
      }),
      dom.element({
        name: 'button',
        attributes: {'class': 'destroy'}
      })
    ]
  });
}

function not(val) {
  return !val;
}

function writeModeTodoItem(attrs) {
  return dom.element({
    name: 'input',
    attributes: {'class': 'edit', value: attrs.text},
    style: {'display': attrs.readMode.map(not).map(displayStyle)},
    handlers: {
      'change': function onChange(evt) {
        attrs.text.set(evt.target.value);
        attrs.readMode.set(true);
      }
    }
  });
}

function completedClass(val) {
  return val ? 'completed' : '';
}

function todoItem(attrs) {
  var itemAttrs = {
    text: attrs.text,
    completed: attrs.completed,
    readMode: observable.publisher(true)
  };

  return dom.element({
    name: 'li',
    attributes: {'class': attrs.completed.map(completedClass)},
    contents: [
      readModeTodoItem(itemAttrs),
      writeModeTodoItem(itemAttrs)
    ]
  });
}

function todoItems(todoData) {
  return todoData.map(todoItem);
}

function todoList(oTodoData) {
  var oItems = oTodoData.map(todoItems);
  return container(oItems, 'ul', 'todo-list');
}

function listItem(xs) {
  return container(xs, 'li');
}

module.exports = {
  clearButton: function(s) { return container([s], 'button', 'clear-completed'); },
  container: container,
  h1: function(s) { return container([s], 'h1'); },
  infoFooter: function(xs) { return container(xs, 'footer', 'info'); },
  link: link,
  listItem: listItem,
  mainSection: function(xs) { return container(xs, 'section', 'main'); },
  newTodoItem: newTodoItem,
  paragraph: function(xs) { return container(xs, 'p'); },
  todoFilters: function(xs) { return container(xs.map(listItem), 'ul', 'filters'); },
  todoFooter: function(xs) { return container(xs, 'footer', 'footer'); },
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