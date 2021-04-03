import test from 'ava';
import * as nlp from '../../src';


test( 'edist', t => {

	var check = function (model, a, b, diff) {

		var edist = nlp.edist_t.apply(null, model);

		var ai, aj, bi, bj, di, dj, m, n, i, expected, actual;

		i = ai = bi = di = dj = 0;
		m  = aj = a.length;
		n  = bj = b.length;


		var d = new Array(m + 1);

		for (; i <= m; ++i) d[i] = new Array(n + 1);

		edist(a, ai, aj, b, bi, bj, d, di, dj);

		expected = model[0] * diff[0] + model[1] * diff[1] + model[2] * diff[2];

		actual = d[m][n];

		t.deepEqual(actual, expected, 'distance check');

	};


	var TEST = [
		['an', 'and', [1, 0, 0]],
		['and', 'an', [0, 1, 0]],
		['an', 'dan', [1, 0, 0]],
		['dan', 'an', [0, 1, 0]],
		['acress', 'actress', [1, 0, 0]],
		['acress', 'across', [0, 0, 1]],
	];

	var MODEL = [
		[1, 1, 1],
		[1, 1, 2]
	];

	for (var m = 0; m < MODEL.length; ++m)
	for (var t = 0; t < TEST.length; ++t)
	check.apply(null, [MODEL[m]].concat(TEST[t]));

});