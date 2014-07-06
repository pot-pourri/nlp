

test('btedist', function(){

	var check = function (model, a, b) {

		var edist   = nlp.edist_t.apply(null, model);
		var btedist = nlp.btedist_t.apply(null, model);

		var ai, aj, bi, bj, di, dj, m, n, i, j, expected, actual, p, pi, k, l, c;

		i = ai = bi = di = dj = pi = 0;
		m = aj = a.length;
		n = bj = b.length;
		p = [];


		var d = new Array(m + 1);

		for (; i <= m; ++i) d[i] = new Array(n + 1);

		edist(a, ai, aj, b, bi, bj, d, di, dj);
		btedist(a, ai, aj, b, bi, bj, d, di, dj, p, pi);

		expected = d[m][n];


		for (k = 0; k < p.length; ++k) {
			i = j = actual = 0;


			for (l = 0; l < p[k].length; ++l) {
				c = p[k][l];
				actual += model[c] * (c !== 2 || a[ai + i] !== b[bi + j] );
				i += (c !== 1);
				j += (c !== 0);
			}


			deepEqual(actual, expected, 'distance check');
		}



	};


	var TEST = [
		['an', 'and'],
		['and', 'an'],
		['an', 'dan'],
		['dan', 'an'],
		['acress', 'actress'],
		['acress', 'across'],
	];

	var MODEL = [
		[1, 1, 1],
		[1, 1, 2]
	];

	for (var m = 0; m < MODEL.length; ++m)
	for (var t = 0; t < TEST.length; ++t)
	check.apply(null, [MODEL[m]].concat(TEST[t]));

});