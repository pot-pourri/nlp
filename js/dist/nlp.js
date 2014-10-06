(function(exports, undefined){

	'use strict';


/* js/src/dist */
/* js/src/dist/btedist.js */



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
/* js/src/dist/edist.js */


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
/* js/src/matching */
/* js/src/matching/find.js */

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

/* js/src/matching/rabinkarp.js */


/**
 *
 * @param {int} d |∑|
 * @param {int} q is the prime number to use to lessen spurious hits
 *
 */

var __rabinkarp__ = function (code, d, q) {

	var rkmatch = function (sh, ph, m, s, si, p, pi) {

		var j;

		if (sh === ph) {
			for (j = 0; j < m; ++j) {
				if (s[si + j] !== p[pi + j]) {
					return false;
				}
			}
			return true;
		}
		else {
			return false;
		}
	};

	var rabinkarp = function (s, si, sj, p, pi, pj, cb) {

		var n, m, i, sh, ph, of;

		n = sj - si;
		m = pj - pi;

		if (n < m) {
			return;
		}

		sh = code(s[si]);
		ph = code(p[pi]);
		of = 1;

		for (i = 1; i < m; ++i) {
			sh *= d;
			sh %= q;
			sh += code(s[si + i]);
			sh %= q;
			ph *= d;
			ph %= q;
			ph += code(p[pi + i]);
			ph %= q;
			of *= d;
			of %= q;
		}


		for (i = si; i < sj - m; ++i) {

			if (rkmatch(sh, ph, m, s, i, p, pi)) {
				cb(s, i, i + m);
			}

			sh -= (code(s[i]) * of) % q;
			sh *= d;
			sh %= q;
			sh += code(s[i + m]);
			sh %= q;
		}


		if (rkmatch(sh, ph, m, s, i, p, pi)) {
			cb(s, i, i + m);
		}


	};

	return rabinkarp;

};

exports.__rabinkarp__ = __rabinkarp__;

})(typeof exports === 'undefined' ? this['nlp'] = {} : exports);
