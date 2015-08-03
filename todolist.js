'use strict';

var observable = require('poochie/observable');
var gizmos = require('./gizmos');
var tododata = require('./tododata');
var todoitem = require('./todoitem');

function todoList(oTodoData, oFragment) {
	function todoItem(itemData, index) {
		var handlers = {
			remove: function() { tododata.removeItem(index, oTodoData); }
                };

		return todoitem.todoItem({
			text: itemData.text,
			completed: itemData.completed,
			handlers: handlers
		});
	}

	function todoItems(todoData, fragment) {
		if (fragment === '/active') {
			todoData = todoData.filter(function(x){ return !x.completed.get(); });
		} else if (fragment === '/completed') {
			todoData = todoData.filter(function(x){ return x.completed.get(); });
		}
		return todoData.map(todoItem);
	}

	var oIsCompletedFields = tododata.getIsCompletedFields(oTodoData);
	var oItems = observable.subscriber([oTodoData, oFragment, oIsCompletedFields], todoItems);
	return gizmos.container(oItems, 'ul', 'todo-list');
}

module.exports = {
	todoList: todoList
};
