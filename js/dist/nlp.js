(function(exports, undefined){

	'use strict';


/* js/src/compare */
/* js/src/compare/natural.js */



/**
 * /!\ This will shuffle when for example
 *
 * a = "sjfdksj 0123 fdjsh 00123";
 * b = "sjfdksj 00123 fdjsh 0123";
 *
 * since both strings have the same length and numbers inside
 * the string are equivalent.
 */

var natural = function ( a, b ) {

	var i, j, k, d, ai, bi, ak, bk, aj, bj, an, bn;

	an = a.length;
	bn = b.length;

	ai = 0;
	bi = 0;

	main : while ( ai < an && bi < bn ) {

		while ( a[ai] < '0' || a[ai] > '9' || b[bi] < '0' || b[bi] > '9' ) {

			d = a[ai] === b[bi] ? 0 : a[ai] < b[bi] ? -1 : 1;

			if ( d !== 0 ) {
				return d;
			}

			++ai;
			++bi;

			if ( ai === an || bi === bn ) {
				break main;
			}

		}

		ak = ai;
		bk = bi;

		while ( ak < an && a[ak] === '0' ) {
			++ak;
		}

		while ( bk < bn && b[bk] === '0' ) {
			++bk;
		}

		if ( ak === an || a[ak] < '0' || a[ak] > '9' ) {
			// a[ai:ak] is "0..0"

			if ( bk === bn || b[bk] < '0' || b[bk] > '9' ) {
				// b[bi:bk] is "0..0"
				ai = ak;
				bi = bk;
				continue;
			}

			else {
				// a[ak:] is empty while b[bk:] is not
				return -1;
			}

		}

		else if ( bk === bn || b[bk] < '0' || b[bk] > '9' ) {
			// b[bk:] is empty while a[ak:] is not
			return 1;
		}


		// a[ak:] starts with some number without leading zeroes
		// b[bk:] starts with some number without leading zeroes

		aj = ak;
		bj = bk;

		while ( true ) {

			++aj;
			++bj;

			if ( aj === an || a[aj] < '0' || a[aj] > '9' ) {

				if ( bj === bn || b[bj] < '0' || b[bj] > '9' ) {

					// the prefixing numbers in a[ak:] and b[bk:] have same length
					// just compare them

					for ( ; ak < aj ; ++ak, ++bk ) {

						d = a[ak] === b[bk] ? 0 : a[ak] < b[bk] ? -1 : 1;

						if ( d !== 0 ) {
							return d;
						}

					}

					// prefixing numbers are equal
					// just continue the comparison by reading
					// the end of the strings

					ai = aj;
					bi = bj;

					continue main;

				}

				else {
					// b[bk:] is prefixed with a larger number
					return -1;
				}

			}

			else if ( bj === bn || b[bj] < '0' || b[bj] > '9' ) {
				// a[ak:] is prefixed with a larger number
				return 1;
			}

		}

	}

	return an - bn;

};

exports.natural = natural;

/* js/src/distance */
/* js/src/distance/btedist.js */



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
/* js/src/distance/edist.js */


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

		sh = code(s[si]) % q;
		ph = code(p[pi]) % q;
		of = 1;

		for (i = 1; i < m; ++i) {
			sh *= d;
			sh %= q;
			sh += code(s[si + i]) % q;
			sh %= q;
			ph *= d;
			ph %= q;
			ph += code(p[pi + i]) % q;
			ph %= q;
			of *= d;
			of %= q;
		}


		for (i = si; i < sj - m; ++i) {

			if (rkmatch(sh, ph, m, s, i, p, pi)) {
				cb(s, i, i + m);
			}

			sh -= ((code(s[i]) % q) * of) % q;
			sh *= d;
			sh %= q;
			sh += code(s[i + m]) % q;
			sh %= q;
		}


		if (rkmatch(sh, ph, m, s, i, p, pi)) {
			cb(s, i, i + m);
		}


	};

	return rabinkarp;

};

exports.__rabinkarp__ = __rabinkarp__;

/* js/src/ngrams */
/* js/src/ngrams/ngrams.js */


var ngrams = function ( n, tokens, out ) {

	var i, j, len, gram;

	len = tokens.length - n;

	for ( i = 0 ; i < len ; ++i ) {

		gram = [];

		for ( j = 0 ; j < n ; ++j ) {
			gram.push( tokens[i + j] );
		}

		out.push( gram );

	}

	return out;

};

exports.ngrams = ngrams;

})(typeof exports === 'undefined' ? this['nlp'] = {} : exports);
