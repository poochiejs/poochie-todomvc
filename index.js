'use strict';

var model = require('./model');
var view = require('./view');

var oTodoData = model.createObservableTodoData();

module.exports = view.container([
  view.todoSection([
    view.todoHeader([
      view.h1('todos'),
      view.newTodoItem('What needs to be done?', oTodoData)
    ]),
    view.mainSection([
      view.toggleCheckbox('Mark all as complete'),
      view.todoList(oTodoData)
    ]),
    view.todoFooter([
      view.todoItemsLeft(oTodoData),
      view.todoFilters([
        view.link('#/', 'All'),
        view.link('#/active', 'Active'),
        view.link('#/completed', 'Completed')
      ]),
      view.clearButton('Clear completed')
    ])
  ]),
  view.infoFooter([
    view.paragraph(['Double-click to edit a todo']),
    view.paragraph([
      'Created by ',
      view.link('https://github.com/garious', 'Greg Fitzgerald')
    ]),
    view.paragraph([
      'May one day be a part of ',
      view.link('http://todomvc.com', 'TodoMVC')
    ])
  ])
]);
