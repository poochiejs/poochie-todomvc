'use strict';

var tododata = require('./tododata');
var todolist = require('./todolist');
var todomisc = require('./todomisc');
var gizmos = require('./gizmos');

var oTodoData = tododata.createObservableTodoData();
tododata.autoSave(oTodoData);

var oFragment = tododata.createObservableFragment();

module.exports = gizmos.container([
	todomisc.todoApp([
		todomisc.header([
			gizmos.h1('todos'),
			todomisc.newTodoItem('What needs to be done?', oTodoData)
		]),
		todomisc.mainSection([
			todomisc.toggleAllCheckbox('Mark all as complete', oTodoData),
			todolist.todoList(oTodoData, oFragment)
		]),
		todomisc.footer([
			todomisc.todoItemsLeft(oTodoData),
			todomisc.filters([
				gizmos.link('#/', 'All', oFragment),
				gizmos.link('#/active', 'Active', oFragment),
				gizmos.link('#/completed', 'Completed', oFragment)
			]),
			todomisc.clearCompletedButton('Clear completed', oTodoData)
		], oTodoData)
	]),
	todomisc.infoFooter([
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
