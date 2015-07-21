'use strict';

var view = require('./view');
var assert = require('assert');

// Test link event handlers.
(function(){
  var link = view.link('a.b.c', 'A');
  assert.equal(link.attributes.class.get(), undefined);

  link.handlers.select();
  assert.equal(link.attributes.class.get(), 'selected');

  link.handlers.blur();
  assert.equal(link.attributes.class.get(), undefined);
})();

module.exports = 'passed!';

