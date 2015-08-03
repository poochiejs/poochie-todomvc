'use strict';

var dom = require('poochie/dom');

function container(contents, name, className) {
	var params = {name: name || 'div', contents: contents};
	if (className) {
		params.attributes = {className: className};
	}
	return dom.element(params);
}

function link(href, text, oFragment) {
	var oClass;
	if (oFragment !== undefined) {
		oClass = oFragment.map(function(fragment) {
			return href === ('#' + fragment) ? 'selected' : '';
		});
	}
	return dom.element({
		name: 'a',
		attributes: {className: oClass, href: href},
		contents: [text]
	});
}

function listItem(xs) {
	return container(xs, 'li');
}

module.exports = {
	container: container,
	h1: function(s) { return container([s], 'h1'); },
	link: link,
	listItem: listItem,
	paragraph: function(xs) { return container(xs, 'p'); }
};
