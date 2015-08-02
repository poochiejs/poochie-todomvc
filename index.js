'use strict';

var model = require('./model');
var view = require('./view');

var oTodoData = model.createObservableTodoData();
model.autoSave(oTodoData);

var oFragment = model.createObservableFragment();

module.exports = view.container([
	view.todoSection([
		view.todoHeader([
			view.h1('todos'),
			view.newTodoItem('What needs to be done?', oTodoData)
		]),
		view.mainSection([
			view.toggleCheckbox('Mark all as complete', oTodoData),
			view.todoList(oTodoData, oFragment)
		]),
		view.todoFooter([
			view.todoItemsLeft(oTodoData),
			view.todoFilters([
				view.link('#/', 'All', oFragment),
				view.link('#/active', 'Active', oFragment),
				view.link('#/completed', 'Completed', oFragment)
			]),
			view.clearButton('Clear completed', oTodoData)
		], oTodoData)
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
