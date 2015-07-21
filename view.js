'use strict';

var dom = require('poochie/dom');

function h1(text) {
  return dom.element({name: 'h1', contents: [text]});
}

function paragraph(contents) {
  return dom.element({name: 'p', contents: contents});
}

function listItem(contents) {
  return dom.element({name: 'li', contents: contents});
}

function link(attrs) {
  return dom.element({
    name: 'a',
    attributes: {'class': attrs.class, href: attrs.href},
    contents: [attrs.text]
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


function clearButton(text) {
  return dom.element({
    name: 'button',
    attributes: {'class': 'clear-completed'},
    contents: [text]
  });
}

function infoFooter(contents) {
  return dom.element({
    name: 'footer',
    attributes: {'class': 'info'},
    contents: contents
  });
}

function mainSection(contents) {
  return dom.element({
    name: 'section',
    attributes: {'class': 'main'},
    contents: contents
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

function todoHeader(contents) {
  return dom.element({
    name: 'header',
    attributes: {'class': 'header'},
    contents: contents
  });
}

function todoFooter(contents) {
  return dom.element({
    name: 'footer',
    attributes: {'class': 'footer'},
    contents: contents
  });
}

function todoSection(contents) {
  return dom.element({
    name: 'section',
    attributes: {'class': 'todoapp'},
    contents: contents
  });
}

function todoFilters(contents) {
  return dom.element({
    name: 'ul',
    attributes: {'class': 'filters'},
    contents: contents.map(listItem)
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

function todoList(contents) {
  return dom.element({
    name: 'ul',
    attributes: {'class': 'todo-list'},
    contents: contents
  });
}

function todoApp(contents) {
  return dom.element({name: 'div', contents: contents});
}

module.exports = {
  clearButton: clearButton,
  h1: h1,
  infoFooter: infoFooter,
  link: link,
  listItem: listItem,
  mainSection: mainSection,
  newTodoItem: newTodoItem,
  paragraph: paragraph,
  todoApp: todoApp,
  todoFilters: todoFilters,
  todoFooter: todoFooter,
  todoHeader: todoHeader,
  todoItem: todoItem,
  todoItemsLeft: todoItemsLeft,
  todoList: todoList,
  todoSection: todoSection,
  toggleCheckbox: toggleCheckbox
};
