import test from 'ava';
import {ngrams} from '../../src';


const macro = ( t, n, tokens, expected ) => {
	t.deepEqual(ngrams( n, tokens, [] ), expected);
};

macro.title = (title, n, tokens, _expected) => title || `ngrams(${n}, ${tokens})`;

test(macro, 1, "abcde", [ ['a'], ['b'], ['c'], ['d'], ['e'] ] );
test(macro, 2, "abcde", [ ['a', 'b'], ['b', 'c'], ['c', 'd'], ['d', 'e'] ] );
test(macro, 3, "abcde", [ ['a', 'b', 'c'], ['b', 'c', 'd'], ['c', 'd', 'e'] ] );
test(macro, 4, "abcde", [ ['a', 'b', 'c', 'd'], ['b', 'c', 'd', 'e'] ] );
test(macro, 5, "abcde", [ ['a', 'b', 'c', 'd', 'e'] ] );
