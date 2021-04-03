


var btedist_t = function(kx, ky, kz) {

	var btedist = function(a, ai, aj, b, bi, bj, d, di, dj, p, pi) {

			var i, j, m, n, x, y, z, k = 0, pj = pi;

			m = aj - ai;
			n = bj - bi;


			if (m === 0) {
				p.push([]);
				while (n--) p[pi].push(1);
				return 1;
			}

			else if (n === 0) {
				p.push([]);
				while (m--) p[pi].push(0);
				return 1;
			}

			i = di + m;
			j = dj + n;

			if (d[i][j] === d[i - 1][j] + kx) {
				pj += btedist(a, ai, aj - 1, b, bi, bj, d, di, dj, p, pj);
				k  += pj - pi;
				for (; pi < pj; ++pi) p[pi].push(0);
			}

			if (d[i][j] === d[i][j - 1] + ky) {
				pj += btedist(a, ai, aj, b, bi, bj - 1, d, di, dj, p, pj);
				k  += pj - pi;
				for (; pi < pj; ++pi) p[pi].push(1);
			}

			if (d[i][j] === d[i - 1][j - 1] + (a[aj - 1] !== b[bj - 1]) * kz) {
				pj += btedist(a, ai, aj - 1, b, bi, bj - 1, d, di, dj, p, pj);
				k  += pj - pi;
				for (; pi < pj; ++pi) p[pi].push(2);
			}

			return k;


	};

	return btedist;

};


exports.btedist_t = btedist_t;