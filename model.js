'use strict';

var observable = require('poochie/observable');
var localStorage = require('localStorage');

function createObservableFragment() {
	var oFragment = observable.publisher('/');

	function onHashChange() {
		oFragment.set(global.location.hash.slice(1) || '/');
	}

	if (global.window) {
		global.window.onhashchange = onHashChange;
		onHashChange();
	}

	return oFragment;
}

function observeTodoItemData(data) {
	return {
		text: observable.publisher(data.text),
		completed: observable.publisher(Boolean(data.completed))
	};
}

function addItem(text, oTodoData) {
	var data = oTodoData.get();
	data.push(observeTodoItemData({text: text}));
	oTodoData.set(data);
}

function removeItem(idx, oTodoData) {
	var data = oTodoData.get();
	data.splice(idx, 1);
	oTodoData.set(data);
}

function isObservableFalse(o) {
	return !o.get();
}

function isObservableTrue(o) {
	return o.get();
}

// Return the value of the 'completed' field.
function completedField(item) {
	return item.completed;
}

// Return the value of the 'text' field.
function textField(item) {
	return item.text;
}

// Return an array of only the value of the 'completed' field
// from the input array.
function textFields(data) {
	return data.map(textField);
}

// Return an array of only the value of the 'completed' field
// from the input array.
function completedFields(data) {
	return data.map(completedField);
}

// Return an array of all observables in the todoList.
function observableFields(data) {
	return textFields(data).concat(completedFields(data));
}

// Return an observable array where each item is an observable
// indicating whether the item is complete or not. It is updated
// if an item is marked complete or if the number of items in the
// list changes.
function getIsCompletedFields(oItems) {
	// An observable of observables.
	var oCompletedFields = oItems.map(completedFields);

	// Notified if any of item changes state, or if the total number of items
	// changes.
	return observable.subscriber(oCompletedFields, function() {
		return oCompletedFields.get();
	});
}

// Return the number of observable items that are currently false.
function getFalseCount(items) {
	return items.filter(isObservableFalse).length;
}

// Return the number of observable items that are currently true.
function getTrueCount(items) {
	return items.filter(isObservableTrue).length;
}

// Return an observable containing the number of items left.
function oGetItemsLeftCount(oItems) {
	return getIsCompletedFields(oItems).map(getFalseCount);
}

// Return an observable containing the number of items completed.
function oGetItemsCompletedCount(oItems) {
	return getIsCompletedFields(oItems).map(getTrueCount);
}

function save(oTodoList) {
	var todoList = observable.snapshot(oTodoList);
	var todoData = JSON.stringify(todoList);
	localStorage.setItem('todoData', todoData);
}

function createObservableTodoData() {
	var todoData = localStorage.getItem('todoData');
	var todoList = JSON.parse(todoData) || [];
	return observable.publisher(todoList.map(observeTodoItemData));
}

function autoSave(oTodoList) {
	var oFields = oTodoList.map(observableFields);
	var oTodoFields = observable.subscriber(oFields, function() {
		return oFields.get();
	});
	oTodoFields.invalidate = function() {
		oTodoFields.get();
		save(oTodoList);
	};
}

module.exports = {
	addItem: addItem,
	autoSave: autoSave,
	createObservableFragment: createObservableFragment,
	createObservableTodoData: createObservableTodoData,
	getIsCompletedFields: getIsCompletedFields,
	oGetItemsLeftCount: oGetItemsLeftCount,
	oGetItemsCompletedCount: oGetItemsCompletedCount,
	removeItem: removeItem
};
