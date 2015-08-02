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

function link(href, text) {
  var oClass = observable.publisher(undefined);
  return dom.element({
    name: 'a',
    attributes: {className: oClass, href: href},
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
      item.completed.set(Boolean(evt.target.checked));
    });
  }

  return dom.element({
    name: 'input',
    attributes: {
      className: 'toggle-all',
      type: 'checkbox',
      checked: model.oGetItemsLeftCount(oTodoData).map(not)
    },
    style: {display: oTodoData.map(len).map(displayStyle)},
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
        contents: attrs.text.map(function(x) { return [x]; })
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
  return dom.element({
    name: 'input',
    attributes: {className: 'edit', value: attrs.text},
    handlers: {
      'change': onChange,
      'blur': onChange
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
  todoList: todoList,
  todoSection: function(xs) { return container(xs, 'section', 'todoapp'); },
  toggleCheckbox: toggleCheckbox,
  readModeTodoItem: readModeTodoItem,
  writeModeTodoItem: writeModeTodoItem
};
