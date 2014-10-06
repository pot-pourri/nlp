
var util = require("util");

var format = util.format;

var code = function (c) {
	return c.charCodeAt(0);
};

var d = 256;
var q = 13;

var rabinkarp = nlp.__rabinkarp__(code, d, q);
var find = nlp.find;



tests = [
	["abcd", "abcde", []],
	["abcd", "abcd", [0]],
	["abcd", "bc", [1]],
	["abcdbdbc", "bc", [1, 6]],
	["abcdbdbcazertyuiopqsdfghjklmwxcvbn", "bc", [1, 6]],
];


var one = function (args) {
	_one.apply(null, [find, "find"].concat(args));
	_one.apply(null, [rabinkarp, "rabinkarp"].concat(args));
};

var _one = function (fn, name, s, p, hit) {
	var si, sj, pi, pj, cb, k;

	si = 0;
	sj = s.length;
	pi = 0;
	pj = p.length;

	k = 0;

	cb = function (seq, i, j) {

		// console.log(name, s, p, seq, i, j);

		if (k < hit.length) {
			deepEqual(seq, s, format("%s > sequence", name));
			deepEqual(i, hit[k], format("%s > begin of '%s' in '%s'", name, p, s));
			deepEqual(j, i + p.length, format("%s > end of '%s' in '%s'", name, p, s));
			++k;
		}
		else {
			++k;
			ok(false, format("%s > ('%s', %d, %d) callback called %d times for '%s' in '%s'", name, seq, i, j, k, p, s));
		}
	};

	fn(s, si, sj, p, pi, pj, cb);

	deepEqual(k, hit.length, format("%s > check number of hits for '%s' in '%s'", name, p, s));

};

test("matching", function () {
	tests.forEach(one);
});
