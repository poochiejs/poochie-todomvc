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

module.exports = {
  addItem: addItem,
  createObservableTodoData: createObservableTodoData
};
