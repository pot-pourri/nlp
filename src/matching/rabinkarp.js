

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
