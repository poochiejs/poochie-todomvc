'use strict';

var view = require('./view');
var observable = require('poochie/observable');

function observeTodoItemData(data) {
  return {
    text: observable.publisher(data.text),
    completed: observable.publisher(Boolean(data.completed))
  };
}

var rawTodoData = [
  {text: 'Taste JavaScript', completed: true},
  {text: 'Buy a unicorn'}
];
var todoData = rawTodoData.map(observeTodoItemData);

module.exports = view.container([
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
