'use strict';

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

function createObservableTodoData() {
  return observable.publisher(rawTodoData.map(observeTodoItemData));
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

// Return an array of only the value of the 'completed' field
// from the input array.
function completedFields(data) {
  return data.map(completedField);
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

module.exports = {
  addItem: addItem,
  createObservableTodoData: createObservableTodoData,
  getIsCompletedFields: getIsCompletedFields,
  oGetItemsLeftCount: oGetItemsLeftCount,
  oGetItemsCompletedCount: oGetItemsCompletedCount,
  removeItem: removeItem
};
