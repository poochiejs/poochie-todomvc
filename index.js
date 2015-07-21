'use strict';

var view = require('./view');

var todoData = [
  {text: 'Taste JavaScript', completed: true},
  {text: 'Buy a unicorn'}
];

module.exports = view.todoApp([
  view.todoSection([
    view.todoHeader([
      view.h1('todos'),
      view.newTodoItem('What needs to be done?')
    ]),
    view.mainSection([
      view.toggleCheckbox('Mark all as complete'),
      view.todoList(todoData.map(view.todoItem))
    ]),
    view.todoFooter([
      view.todoItemsLeft(0),
      view.todoFilters([
        view.link({'class': 'selected', href: '#/', text: 'All'}),
        view.link({href: '#/active', text: 'Active'}),
        view.link({href: '#/completed', text: 'Completed'})
      ]),
      view.clearButton('Clear completed')
    ])
  ]),
  view.infoFooter([
    view.paragraph(['Double-click to edit a todo']),
    view.paragraph([
      'Created by ',
      view.link({href: 'https://github.com/garious', text: 'Greg Fitzgerald'})
    ]),
    view.paragraph([
      'May one day be a part of ',
      view.link({href: 'http://todomvc.com', text: 'TodoMVC'})
    ])
  ])
]);
