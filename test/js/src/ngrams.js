
var one;

one = function ( n, tokens, expected ) {

	deepEqual( nlp.ngrams( n, tokens, [] ), expected, JSON.stringify( n, tokens ) );

};

test( "ngrams", function () {

	one( 1, "abcde", [ ['a'], ['b'], ['c'], ['d'], ['e'] ] );
	one( 2, "abcde", [ ['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'] ] );
	one( 3, "abcde", [ ['a', 'b', 'c'], ['b', 'c', 'd'], ['c', 'd', 'e'] ] );
	one( 4, "abcde", [ ['a', 'b', 'c', 'd'], ['b', 'c', 'd', 'e'] ] );
	one( 5, "abcde", [ ['a', 'b', 'c', 'd', 'e'] ] );

} );
