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

var oTodoData = observable.publisher(rawTodoData.map(observeTodoItemData));

module.exports = {
  oTodoData: oTodoData
};
