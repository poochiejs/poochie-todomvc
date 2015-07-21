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

function todoItemsLeft(numItems) {
  return dom.element({
    name: 'span',
    attributes: {'class': 'todo-count'},
    contents: [
       dom.element({name: 'strong', contents: [String(numItems)]}),
       ' items left'
    ]
  });
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

function todoItem(attrs) {
  return dom.element({
    name: 'li',
    attributes: attrs.completed ? {'class': 'completed'} : {},
    contents: [
      dom.element({
        name: 'div',
        attributes: {'class': 'view'},
        contents: [
          dom.element({
            name: 'input',
            attributes: {'class': 'toggle', type: 'checkbox', checked: attrs.completed}
          }),
          dom.element({
            name: 'label',
            contents: [attrs.text]
          }),
          dom.element({
            name: 'button',
            attributes: {'class': 'destroy'}
          })
        ]
      }),
      dom.element({
        name: 'input',
        attributes: {'class': 'edit', value: 'Create a TodoMVC template'}
      })
    ]
  });
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
  todoList: function(xs) { return container(xs, 'ul', 'todo-list'); },
  todoSection: function(xs) { return container(xs, 'section', 'todoapp'); },
  toggleCheckbox: toggleCheckbox
};
