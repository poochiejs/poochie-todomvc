'use strict';

var dom = require('poochie/dom');

var todoHdr = dom.element({
  name: 'h1',
  contents: ['todos']
});

var input = dom.element({
  name: 'input',
  attributes: {
    'class': 'new-todo',
    placeholder: 'What needs to be done?',
    autofocus: true
  },
  contents: ['todos']
});

var todoHeader = dom.element({
  name: 'header',
  attributes: {'class': 'header'},
  contents: [todoHdr, input]
});

var toggleAllInput = dom.element({
  name: 'input',
  attributes: {'class': 'toggle-all', type: 'checkbox'}
});

var toggleAllLabel = dom.element({
  name: 'label',
  attributes: {'for': 'toggle-all'},
  contents: ['Mark all as complete']
});

// These are here just to show the structure of the list items.
// List items should get the class `editing` when editing and `completed` when
// marked as completed.
var todoItem1 = dom.element({
  name: 'li',
  attributes: {'class': 'completed'},
  contents: [
    dom.element({
      name: 'div',
      attributes: {'class': 'view'},
      contents: [
        dom.element({
          name: 'input',
          attributes: {'class': 'toggle', type: 'checkbox', checked: true}
        }),
        dom.element({
          name: 'label',
          contents: ['Taste JavaScript']
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

var todoItem2 = dom.element({
  name: 'li',
  contents: [
    dom.element({
      name: 'div',
      attributes: {'class': 'view'},
      contents: [
        dom.element({
          name: 'input',
          attributes: {'class': 'toggle', type: 'checkbox'}
        }),
        dom.element({
          name: 'label',
          contents: ['Buy a unicorn']
        }),
        dom.element({
          name: 'button',
          attributes: {'class': 'destroy'}
        })
      ]
    }),
    dom.element({
      name: 'input',
      attributes: {'class': 'edit', value: 'Rule the web'}
    })
  ]
});

var todoList = dom.element({
  name: 'ul',
  attributes: {'class': 'todo-list'},
  contents: [todoItem1, todoItem2]
});

var mainSection = dom.element({
  name: 'section',
  attributes: {'class': 'main'},
  contents: [toggleAllInput, toggleAllLabel, todoList]
});

// This should be `0 items left` by default.
var itemsLeft = dom.element({
  name: 'span',
  attributes: {'class': 'todo-count'},
  contents: [
     dom.element({name: 'strong', contents: ['0']}),
     ' items left'
  ]
});

var selectedFilter = dom.element({
  name: 'li',
  contents: dom.element({
    name: 'a',
    attributes: {'class': 'selected', href: '#/'},
    contents: ['All']
  })
});

var activeFilter = dom.element({
  name: 'li',
  contents: dom.element({
    name: 'a',
    attributes: {href: '#/active'},
    contents: ['Active']
  })
});

var completedFilter = dom.element({
  name: 'li',
  contents: dom.element({
    name: 'a',
    attributes: {href: '#/completed'},
    contents: ['Completed']
  })
});

// TODO: Remove this if you don't implement routing.
var filters = dom.element({
  name: 'ul',
  attributes: {'class': 'filters'},
  contents: [selectedFilter, activeFilter, completedFilter]
});


// Hidden if no completed items are left.
var clearButton = dom.element({
  name: 'button',
  attributes: {'class': 'clear-completed'},
  contents: ['Clear completed']
});

var todoFooter = dom.element({
  name: 'footer',
  attributes: {'class': 'footer'},
  contents: [itemsLeft, filters, clearButton]
});

var todoSection = dom.element({
  name: 'section',
  attributes: {'class': 'todoapp'},
  contents: [todoHeader, mainSection, todoFooter]
});

var editMsg = dom.element({
  name: 'p',
  contents: ['Double-click to edit a todo']
});

var credits = dom.element({
  name: 'p',
  contents: [
    'Created by ',
    dom.element({
      name: 'a',
      attributes: {href: 'https://github.com/garious'},
      contents: ['Greg Fitzgerald']
    })
  ]
});

var credits2 = dom.element({
  name: 'p',
  contents: [
    'May one day be a part of ',
    dom.element({
      name: 'a',
      attributes: {href: 'http://todomvc.com'},
      contents: ['TodoMVC']
    })
  ]
});

var footer = dom.element({
  name: 'footer',
  attributes: {'class': 'info'},
  contents: [editMsg, credits, credits2]
});

module.exports = dom.element({
  name: 'div',
  contents: [todoSection, footer]
});

