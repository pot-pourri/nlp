import test from 'ava';
import * as nlp from '../../../src';

import {pairs} from "../../data/stemming/porter/reference.js" ;

const macro = ( t, source , expected ) => {

	const p = source.split( "" ) ;
	const pi = 0 ;
	const pj = p.length ;

	const oj = nlp.porter( p , pi , pj ) + 1 ;

	const output = p.slice( pi , oj ).join( "" ) ;

	t.deepEqual( output , expected , source ) ;

} ;

macro.title = (title, source, expected) => title || `${source} ~ ${expected}`;

test(macro, "ion"       , "ion" ) ;

test(macro, "ied"       , "i" ) ;
test(macro, "aing"      , "a" ) ;

test(macro, "caresses"  , "caress" ) ;
test(macro, "ponies"    , "poni" ) ;
test(macro, "caress"    , "caress" ) ;

test(macro, "matting"   , "mat" ) ;
test(macro, "mating"    , "mate" ) ;
test(macro, "milling"   , "mill" ) ;
test(macro, "messing"   , "mess" ) ;

test(macro, "journalism" , "journal" ) ;

test(macro, "fossilization" , "fossil" ) ;
test(macro, "civilization" , "civil" ) ;

for (const [source, expected] of pairs) test(macro, source, expected);
