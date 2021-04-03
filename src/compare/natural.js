


/**
 * /!\ This will shuffle when for example
 *
 * a = "sjfdksj 0123 fdjsh 00123";
 * b = "sjfdksj 00123 fdjsh 0123";
 *
 * since both strings have the same length and numbers inside
 * the string are equivalent.
 */

export function natural ( a, b ) {

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

}

