
test( "natural", function () {

	ok( nlp.natural(  "ab", "abc" )  <  0, "regular string by length <" );
	ok( nlp.natural( "abc", "abc" ) === 0, "regular string by length =" );
	ok( nlp.natural( "abc",  "ab" )  >  0, "regular string by length >" );

	ok( nlp.natural( "abb", "abc" )  <  0, "regular string same length <" );
	ok( nlp.natural( "abc", "abc" ) === 0, "regular string same length =" );
	ok( nlp.natural( "abc", "abb" )  >  0, "regular string same length >" );

	ok( nlp.natural( "1abc", "2abc" )  <  0, "string with number in front <" );
	ok( nlp.natural( "2abc", "2abc" ) === 0, "string with number in front =" );
	ok( nlp.natural( "3abc", "2abc" )  >  0, "string with number in front >" );

	ok( nlp.natural(  "9abc", "10abc" )  <  0, "string natural comparison <" );
	ok( nlp.natural( "10abc", "10abc" ) === 0, "string natural comparison =" );
	ok( nlp.natural( "11abc", "10abc" )  >  0, "string natural comparison >" );

	ok( nlp.natural( "009abc", "010abc" )  <  0, "string natural comparison with 3 digit numbers <" );
	ok( nlp.natural( "010abc", "010abc" ) === 0, "string natural comparison with 3 digit numbers =" );
	ok( nlp.natural( "011abc", "010abc" )  >  0, "string natural comparison with 3 digit numbers >" );

	ok( nlp.natural( "009abc", "10abc" )  <  0, "string natural comparison with leading zeroes in a <" );
	ok( nlp.natural( "010abc0", "10abc00" ) === 0, "string natural comparison with leading zeroes in a =" );
	ok( nlp.natural( "011abc", "10abc" )  >  0, "string natural comparison with leading zeroes in a >" );

	ok( nlp.natural(  "9abc", "010abc" )  <  0, "string natural comparison with leading zeroes in b <" );
	ok( nlp.natural( "10abc00", "010abc0" ) === 0, "string natural comparison with leading zeroes in b =" );
	ok( nlp.natural( "11abc", "010abc" )  >  0, "string natural comparison with leading zeroes in b >" );

	ok( nlp.natural( "abc123abc1234", "abc123abc123" ) > 0, "a prefixed with a larger number (end) >" );
	ok( nlp.natural( "abc123abc1234abc", "abc123abc123abc" ) > 0, "a prefixed with a larger number (middle) >" );
	ok( nlp.natural( "1234abc123abc123abc", "123abc123abc1234abc" ) > 0, "a prefixed with a larger number (start) >" );

	ok( nlp.natural( "abc123abc123", "abc123abc1234" ) < 0, "b prefixed with a larger number (end) >" );
	ok( nlp.natural( "abc123abc123abc", "abc123abc1234abc" ) < 0, "b prefixed with a larger number (middle) >" );
	ok( nlp.natural( "123abc123abc1234abc", "1234abc123abc123abc" ) < 0, "b prefixed with a larger number (start) >" );

	ok( nlp.natural(  "0", "0a" )  <  0, "zeroes followed by a) void b) string <" );
	ok( nlp.natural(  "0",  "0" ) === 0, "zeroes followed by a) void b) void =" );
	ok( nlp.natural( "0a", "0a" ) === 0, "zeroes followed by a) string b) string =" );
	ok( nlp.natural( "0a",  "0" )  >  0, "zeroes followed by a) void b) string >" );

	ok( nlp.natural(  "0", "01" )  <  0, "zeroes followed by a) void b) digits <" );
	ok( nlp.natural(  "0",  "0" ) === 0, "zeroes followed by a) void b) void =" );
	ok( nlp.natural( "01", "01" ) === 0, "zeroes followed by a) digits b) digits =" );
	ok( nlp.natural( "01",  "0" )  >  0, "zeroes followed by a) void b) digits >" );

});
