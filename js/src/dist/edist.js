

var edist_t = function(kx, ky, kz) {

	var edist = function(a, ai, aj, b, bi, bj, d, di, dj){
		var i, j, m, n, x, y, z;

		m = aj - ai;
		n = bj - bi;

		d[di][dj] = 0;

		for (i = 1; i <= m; ++i) d[di + i][0] = i;
		for (j = 1; j <= n; ++j) d[0][dj + j] = j;


		for (i = 1; i <= m; ++i) {
			for (j = 1; j <= n; ++j) {
				
				x = d[di + i - 1][dj + j] + kx;
				y = d[di + i][dj + j - 1] + ky;
				z = d[di + i - 1][dj + j - 1] + (a[ai + i - 1] !== b[bi + j - 1]) * kz;

		 		d[di + i][dj + j] = Math.min(x, y, z);
			}
		}


	};

	return edist;

};


exports.edist_t = edist_t;