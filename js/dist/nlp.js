( function ( ) {

'use strict' ;

var definition = function ( exports , undefined ) {


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

	len = tokens.length - n + 1;

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

/* js/src/stemming */
/* js/src/stemming/porter.js */
/**
 * Imported from http://tartarus.org/martin/PorterStemmer/c.txt. All comments
 * below are from the original version in ANSI C.
 */

/* This is the Porter stemming algorithm, coded up in ANSI C by the
   author. It may be be regarded as canonical, in that it follows the
   algorithm presented in

   Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
   no. 3, pp 130-137,

   only differing from it at the points marked --DEPARTURE-- below.

   See also http://www.tartarus.org/~martin/PorterStemmer

   The algorithm as described in the paper could be exactly replicated
   by adjusting the points of DEPARTURE, but this is barely necessary,
   because (a) the points of DEPARTURE are definitely improvements, and
   (b) no encoding of the Porter stemmer I have seen is anything like
   as exact as this version, even with the points of DEPARTURE!

   You can compile it on Unix with 'gcc -O3 -o stem stem.c' after which
   'stem' takes a list of inputs and sends the stemmed equivalent to
   stdout.

   The algorithm as encoded here is particularly fast.

   Release 1: was many years ago
   Release 2: 11 Apr 2013
       fixes a bug noted by Matt Patenaude <matt@mattpatenaude.com>,

       case 'o': if (ends("\03" "ion") && (b[j] == 's' || b[j] == 't')) break;
           ==>
       case 'o': if (ends("\03" "ion") && j >= k0 && (b[j] == 's' || b[j] == 't')) break;

       to avoid accessing b[k0-1] when the word in b is "ion".
   Release 3: 25 Mar 2014
       fixes a similar bug noted by Klemens Baum <klemensbaum@gmail.com>,
       that if step1ab leaves a one letter result (ied -> i, aing -> a etc),
       step2 and step4 access the byte before the first letter. So we skip
       steps after step1ab unless k > k0.
*/

/* The main part of the stemming algorithm starts here. b is a buffer
   holding a word to be stemmed. The letters are in b[k0], b[k0+1] ...
   ending at b[k]. In fact k0 = 0 in this demo program. k is readjusted
   downwards as the stemming progresses. Zero termination is not in fact
   used in the algorithm.

   Note that only lower case sequences are stemmed. Forcing to lower case
   should be done before stem(...) is called.
*/

var porter = function ( p , pi , pj ) {

// buffer for word to be stemmed
var b ;

// j is a general offset into the string
var k , k0 , j ;


/**
 * cons(i) is true <=> b[i] is a consonant.
 */
var cons = function ( i ) {
	switch ( b[i] ) {
		case 'a' : case 'e' : case 'i' : case 'o' : case 'u' : return false ;
		case 'y' : return ( i === k0 ) ? true : !cons( i - 1 ) ;
		default : return true ;
	}
} ;

/**
 * m() measures the number of consonant sequences between k0 and j. if c is
 * a consonant sequence and v a vowel sequence, and <..> indicates arbitrary
 * presence,
 *
 *     <c><v>       gives 0
 *     <c>vc<v>     gives 1
 *     <c>vcvc<v>   gives 2
 *     <c>vcvcvc<v> gives 3
 *     ....
 */

var m = function ( ) {

	var i , n ;

	n = 0 ;
	i = k0 ;

	while ( true ) {
		if ( i > j ) return n ;
		if ( !cons( i ) ) break ;
		++i ;
   }

   ++i ;
   while(true)
   {  while(true)
      {  if (i > j) return n;
            if (cons(i)) break;
            i++;
      }
      i++;
      n++;
      while(true)
      {  if (i > j) return n;
         if (! cons(i)) break;
         i++;
      }
      i++;
   }
} ;

/**
 * vowelinstem() is true <=> k0,...j contains a vowel
 */
var vowelinstem = function ()
{  var i; for (i = k0; i <= j; i++) if (! cons(i)) return true;
   return false;
} ;

/**
 * doublec(j) is true <=> j,(j-1) contain a double consonant.
 */
var doublec = function ( j ) {
	if (j < k0+1) return false;
   if (b[j] != b[j-1]) return false;
   return cons(j);
} ;

/**
 * cvc(i) is true <=> i-2,i-1,i has the form consonant - vowel - consonant
 * and also if the second c is not w,x or y. this is used when trying to
 * restore an e at the end of a short word. e.g.
 *
 *     cav(e), lov(e), hop(e), crim(e), but
 *     snow, box, tray.
 *
 */
var cvc = function ( i )
{  if (i < k0+2 || !cons(i) || cons(i-1) || !cons(i-2)) return false;
   {  var ch = b[i];
      if (ch == 'w' || ch == 'x' || ch == 'y') return false;
   }
   return true;
};

/**
 * memcmp in JavaScript
 */
var memcmp = function ( a , ai , aj , b , bi ) {

	for ( ; ai < aj ; ++ai , ++bi ) {
		if ( a[ai] === b[bi] ) continue ;
		return a[ai] < b[bi] ? -1 : 1 ;
	}

	return 0 ;

} ;

/**
 * ends(s) is true <=> k0,...k ends with the string s.
 */

var ends = function ( s ) {
	var len = s.length ;
	if ( s[len - 1] !== b[k] ) return false ; /* tiny speed-up */
	if ( len > k - k0 + 1 ) return false ;
	if ( memcmp( b , k - len + 1 , k + 1 , s , 0 ) !== 0 ) return false ;
	j = k - len ;
	return true ;
} ;

/**
 * memmove in JavaScript. ( not exactly because it would require to copy
 * backwards in case a and b are the same array and bi > ai but we don't need
 * that in our use case )
 */

var memmove = function ( a , ai , aj , b , bi ) {

	for ( ; ai < aj ; ++ai , ++bi ) {
		b[bi] = a[ai] ;
	}

} ;

/**
 * setto(s) sets (j+1),...k to the characters in the string s, readjusting k.
 */

var setto = function ( s ) {
	var len = s.length ;
	memmove( s , 0 , len , b , j + 1 ) ;
	k = j + len ;
} ;

/**
 * r(s) is used further down.
 */

var r = function ( s ) {
	if ( m( ) > 0 ) setto( s ) ;
} ;

/**
 * step1ab() gets rid of plurals and -ed or -ing. e.g.
 *
 *      caresses  ->  caress
 *      ponies    ->  poni
 *      ties      ->  ti
 *      caress    ->  caress
 *      cats      ->  cat
 *
 *      feed      ->  feed
 *      agreed    ->  agree
 *      disabled  ->  disable
 *
 *      matting   ->  mat
 *      mating    ->  mate
 *      meeting   ->  meet
 *      milling   ->  mill
 *      messing   ->  mess
 *
 *      meetings  ->  meet
 *
 */

var step1ab = function ( ) {
	var ch ;
	if (b[k] == 's')
	{  if (ends( "sses")) k -= 2; else
	  if (ends( "ies")) setto( "i"); else
	  if (b[k-1] != 's') k--;
	}
	if (ends( "eed")) { if (m() > 0) k--; } else
	if ((ends( "ed") || ends( "ing")) && vowelinstem())
	{  k = j;
	  if (ends( "at")) setto( "ate"); else
	  if (ends( "bl")) setto( "ble"); else
	  if (ends( "iz")) setto( "ize"); else
	  if (doublec(k))
	  {  k--;
		 {  ch = b[k];
			if (ch == 'l' || ch == 's' || ch == 'z') k++;
		 }
	  }
	  else if (m() == 1 && cvc(k)) setto( "e");
	}
} ;


/**
 * step1c() turns terminal y to i when there is another vowel in the stem.
 */

var step1c = function ( ) {
	if (ends("y") && vowelinstem()) b[k] = 'i';
} ;


/**
 * step2() maps double suffices to single ones. so -ization ( = -ize plus
 * -ation) maps to -ize etc. note that the string before the suffix must give
 * m() > 0.
 */

var step2 = function ( ) {
	switch (b[k-1]) {

		case 'a': if (ends( "ational")) { r( "ate"); break; }
				  if (ends( "tional")) { r( "tion"); break; }
				  break;
		case 'c': if (ends( "enci")) { r( "ence"); break; }
				  if (ends( "anci")) { r( "ance"); break; }
				  break;
		case 'e': if (ends( "izer")) { r( "ize"); break; }
				  break;
		case 'l': if (ends( "bli")) { r( "ble"); break; } /*-DEPARTURE-*/

		/* To match the published algorithm, replace this line with
		case 'l': if (ends("abli")) { r("able"); break; } */

				  if (ends( "alli")) { r( "al"); break; }
				  if (ends( "entli")) { r( "ent"); break; }
				  if (ends( "eli")) { r( "e"); break; }
				  if (ends( "ousli")) { r( "ous"); break; }
				  break;
		case 'o': if (ends( "ization")) { r( "ize"); break; }
				  if (ends( "ation")) { r( "ate"); break; }
				  if (ends( "ator")) { r( "ate"); break; }
				  break;
		case 's': if (ends( "alism")) { r( "al"); break; }
				  if (ends( "iveness")) { r( "ive"); break; }
			  if (ends( "fulness")) { r( "ful"); break; }
			  if (ends( "ousness")) { r( "ous"); break; }
			  break;
	case 't': if (ends( "aliti")) { r( "al"); break; }
			  if (ends( "iviti")) { r( "ive"); break; }
			  if (ends( "biliti")) { r( "ble"); break; }
			  break;
	case 'g': if (ends( "logi")) { r( "log"); break; } /*-DEPARTURE-*/

	/* To match the published algorithm, delete this line */

	}

} ;

/**
 * step3() deals with -ic-, -full, -ness etc. similar strategy to step2.
 */

var step3 = function ( ) { switch (b[k])
{
    case 'e': if (ends( "icate")) { r( "ic"); break; }
              if (ends( "ative")) { r( ""); break; }
              if (ends( "alize")) { r( "al"); break; }
              break;
    case 'i': if (ends( "iciti")) { r( "ic"); break; }
              break;
    case 'l': if (ends( "ical")) { r( "ic"); break; }
              if (ends( "ful")) { r( ""); break; }
              break;
    case 's': if (ends( "ness")) { r( ""); break; }
              break;
} };

/**
 * step4() takes off -ant, -ence etc., in context <c>vcvc<v>.
 */

var step4 = function ()
{  switch (b[k-1])
    {  case 'a': if (ends( "al")) break; return;
       case 'c': if (ends( "ance")) break;
                 if (ends( "ence")) break; return;
       case 'e': if (ends( "er")) break; return;
       case 'i': if (ends( "ic")) break; return;
       case 'l': if (ends( "able")) break;
                 if (ends( "ible")) break; return;
       case 'n': if (ends( "ant")) break;
                 if (ends( "ement")) break;
                 if (ends( "ment")) break;
                 if (ends( "ent")) break; return;
       case 'o': if (ends( "ion") && j >= k0 && (b[j] == 's' || b[j] == 't')) break;
                 if (ends( "ou")) break; return;
                 /* takes care of -ous */
       case 's': if (ends( "ism")) break; return;
       case 't': if (ends( "ate")) break;
                 if (ends( "iti")) break; return;
       case 'u': if (ends( "ous")) break; return;
       case 'v': if (ends( "ive")) break; return;
       case 'z': if (ends( "ize")) break; return;
       default: return;
    }
    if (m() > 1) k = j;
} ;

/**
 * step5() removes a final -e if m() > 1, and changes -ll to -l if m() > 1.
 */

var step5 = function ()
{  j = k;
   if (b[k] == 'e')
   {  var a = m();
      if (a > 1 || a == 1 && !cvc(k-1)) k--;
   }
   if (b[k] == 'l' && doublec(k) && m() > 1) k--;
};

/**
 * In stem(p,i,j), p is a char pointer, and the string to be stemmed is from
 * p[i] to p[j] inclusive. Typically i is zero and j is the offset to the last
 * character of a string, (p[j+1] == '\0'). The stemmer adjusts the
 * characters p[i] ... p[j] and returns the new end-point of the string, k.
 * Stemming never increases word length, so i <= k <= j. To turn the stemmer
 * into a module, declare 'stem' as extern, and delete the remainder of this
 * file.
 */

var stem = function ( p , i , j )
{  b = p; k = j; k0 = i; /* copy the parameters into statics */
   if (k <= k0+1) return k; /*-DEPARTURE-*/

   /* With this line, strings of length 1 or 2 don't go through the
      stemming process, although no mention is made of this in the
      published algorithm. Remove the line to match the published
      algorithm. */

   step1ab();
   if (k > k0) {
       step1c(); step2(); step3(); step4(); step5();
   }
   return k;
} ;

	return stem( p , pi , pj - 1 ) ;

} ;

exports.porter = porter ;

return exports ;
} ;
if ( typeof exports === "object" ) {
	definition( exports ) ;
}
else if ( typeof define === "function" && define.amd ) {
	define( "@aureooms/js-nlp" , [ ] , function ( ) { return definition( { } ) ; } ) ;
}
else if ( typeof window === "object" && typeof window.document === "object" ) {
	definition( window["nlp"] = { } ) ;
}
else console.error( "unable to detect type of module to define for @aureooms/js-nlp") ;
} )( ) ;
