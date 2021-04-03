import test from 'ava';
import * as nlp from '../../../src';

test( "natural", t => {

	t.truthy( nlp.natural(  "ab", "abc" )  <  0, "regular string by length <" );
	t.truthy( nlp.natural( "abc", "abc" ) === 0, "regular string by length =" );
	t.truthy( nlp.natural( "abc",  "ab" )  >  0, "regular string by length >" );

	t.truthy( nlp.natural( "abb", "abc" )  <  0, "regular string same length <" );
	t.truthy( nlp.natural( "abc", "abc" ) === 0, "regular string same length =" );
	t.truthy( nlp.natural( "abc", "abb" )  >  0, "regular string same length >" );

	t.truthy( nlp.natural( "1abc", "2abc" )  <  0, "string with number in front <" );
	t.truthy( nlp.natural( "2abc", "2abc" ) === 0, "string with number in front =" );
	t.truthy( nlp.natural( "3abc", "2abc" )  >  0, "string with number in front >" );

	t.truthy( nlp.natural(  "9abc", "10abc" )  <  0, "string natural comparison <" );
	t.truthy( nlp.natural( "10abc", "10abc" ) === 0, "string natural comparison =" );
	t.truthy( nlp.natural( "11abc", "10abc" )  >  0, "string natural comparison >" );

	t.truthy( nlp.natural( "009abc", "010abc" )  <  0, "string natural comparison with 3 digit numbers <" );
	t.truthy( nlp.natural( "010abc", "010abc" ) === 0, "string natural comparison with 3 digit numbers =" );
	t.truthy( nlp.natural( "011abc", "010abc" )  >  0, "string natural comparison with 3 digit numbers >" );

	t.truthy( nlp.natural( "009abc", "10abc" )  <  0, "string natural comparison with leading zeroes in a <" );
	t.truthy( nlp.natural( "010abc0", "10abc00" ) === 0, "string natural comparison with leading zeroes in a =" );
	t.truthy( nlp.natural( "011abc", "10abc" )  >  0, "string natural comparison with leading zeroes in a >" );

	t.truthy( nlp.natural(  "9abc", "010abc" )  <  0, "string natural comparison with leading zeroes in b <" );
	t.truthy( nlp.natural( "10abc00", "010abc0" ) === 0, "string natural comparison with leading zeroes in b =" );
	t.truthy( nlp.natural( "11abc", "010abc" )  >  0, "string natural comparison with leading zeroes in b >" );

	t.truthy( nlp.natural( "abc123abc1234", "abc123abc123" ) > 0, "a prefixed with a larger number (end) >" );
	t.truthy( nlp.natural( "abc123abc1234abc", "abc123abc123abc" ) > 0, "a prefixed with a larger number (middle) >" );
	t.truthy( nlp.natural( "1234abc123abc123abc", "123abc123abc1234abc" ) > 0, "a prefixed with a larger number (start) >" );

	t.truthy( nlp.natural( "abc123abc123", "abc123abc1234" ) < 0, "b prefixed with a larger number (end) >" );
	t.truthy( nlp.natural( "abc123abc123abc", "abc123abc1234abc" ) < 0, "b prefixed with a larger number (middle) >" );
	t.truthy( nlp.natural( "123abc123abc1234abc", "1234abc123abc123abc" ) < 0, "b prefixed with a larger number (start) >" );

	t.truthy( nlp.natural(  "0", "0a" )  <  0, "zeroes followed by a) void b) string <" );
	t.truthy( nlp.natural(  "0",  "0" ) === 0, "zeroes followed by a) void b) void =" );
	t.truthy( nlp.natural( "0a", "0a" ) === 0, "zeroes followed by a) string b) string =" );
	t.truthy( nlp.natural( "0a",  "0" )  >  0, "zeroes followed by a) void b) string >" );

	t.truthy( nlp.natural(  "0", "01" )  <  0, "zeroes followed by a) void b) digits <" );
	t.truthy( nlp.natural(  "0",  "0" ) === 0, "zeroes followed by a) void b) void =" );
	t.truthy( nlp.natural( "01", "01" ) === 0, "zeroes followed by a) digits b) digits =" );
	t.truthy( nlp.natural( "01",  "0" )  >  0, "zeroes followed by a) void b) digits >" );

});
