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
