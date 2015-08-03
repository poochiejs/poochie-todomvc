'use strict';

var tododata = require('./tododata');
var todolist = require('./todolist');
var gizmos = require('./gizmos');

var oTodoData = tododata.createObservableTodoData();
tododata.autoSave(oTodoData);

var oFragment = tododata.createObservableFragment();

module.exports = gizmos.container([
	gizmos.todoSection([
		gizmos.todoHeader([
			gizmos.h1('todos'),
			gizmos.newTodoItem('What needs to be done?', oTodoData)
		]),
		gizmos.mainSection([
			gizmos.toggleAllCheckbox('Mark all as complete', oTodoData),
			todolist.todoList(oTodoData, oFragment)
		]),
		gizmos.todoFooter([
			gizmos.todoItemsLeft(oTodoData),
			gizmos.todoFilters([
				gizmos.link('#/', 'All', oFragment),
				gizmos.link('#/active', 'Active', oFragment),
				gizmos.link('#/completed', 'Completed', oFragment)
			]),
			gizmos.clearButton('Clear completed', oTodoData)
		], oTodoData)
	]),
	gizmos.infoFooter([
		gizmos.paragraph(['Double-click to edit a todo']),
		gizmos.paragraph([
			'Created by ',
			gizmos.link('https://github.com/garious', 'Greg Fitzgerald')
		]),
		gizmos.paragraph([
			'May one day be a part of ',
			gizmos.link('http://todomvc.com', 'TodoMVC')
		])
	])
]);
