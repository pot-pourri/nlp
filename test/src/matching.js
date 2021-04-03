import test from 'ava';
import {find, __rabinkarp__} from '../../src';

const code = (c) => c.charCodeAt(0);
const d = 256;
const q = 13;

const rabinkarp = __rabinkarp__(code, d, q);

const algorithms = [find, rabinkarp];

const inputs = [
	["abcd", "abcde", []],
	["abcd", "abcd", [0]],
	["abcd", "bc", [1]],
	["abcdbdbc", "bc", [1, 6]],
	["abcdbdbcazertyuiopqsdfghjklmwxcvbn", "bc", [1, 6]],
];

const macro = (t, fn, s, p, hit) => {
	const name = fn.name;

	const si = 0;
	const sj = s.length;
	const pi = 0;
	const pj = p.length;

	let k = 0;

	const cb = (seq, i, j) => {

		// console.log(name, s, p, seq, i, j);

		if (k < hit.length) {
			t.deepEqual(seq, s, `${name} > sequence`);
			t.deepEqual(i, hit[k], `${name} > begin of '${p}' in '${s}'`);
			t.deepEqual(j, i + p.length, `${name} > end of '${p}' in '${s}'`);
			++k;
		}
		else {
			++k;
			t.fail(`"${name} > ('${seq}', ${i}, ${j}) callback called ${k} times for '${p}' in '${s}'`);
		}
	};

	fn(s, si, sj, p, pi, pj, cb);

	t.deepEqual(k, hit.length, `${name} > check number of hits for '${p}' in '${s}'`);

};

macro.title = (title, algorithm, string, pattern, _hits) => title || `${algorithm.name}('${string}', '${pattern}')`;

for (const algorithm of algorithms) {
	for (const [string, pattern, hits] of inputs) {
		test(macro, algorithm, string, pattern, hits);
	}
}
