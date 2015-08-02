'use strict';

function not(val) {
	return !val;
}

function len(xs) {
	return xs.length;
}

function singleton(x) {
	return [x];
}

module.exports = {
	not: not,
	len: len,
	singleton: singleton
};
