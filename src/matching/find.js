
var find = function (s, si, sj, p, pi, pj, cb) {

	var m, j;

	m = pj - pi;

	sequence : for (; si <= sj - m; ++si) {

		for (j = 0; j < m; ++j) {
			if (s[si + j] !== p[pi + j]) {
				continue sequence;
			}
		}

		cb(s, si, si + m);

	}

};

exports.find = find;
