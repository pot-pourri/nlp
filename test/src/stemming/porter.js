import test from 'ava';
import * as nlp from '../../../src';

var t = function ( source , expected ) {

	var p , pi , pj , oj , output ;

	p = source.split( "" ) ;
	pi = 0 ;
	pj = p.length ;

	oj = nlp.porter( p , pi , pj ) + 1 ;

	output = p.slice( pi , oj ).join( "" ) ;

	t.deepEqual( output , expected , source ) ;

} ;

test( "Porter stemmer" , t => {

	t( "ion"       , "ion" ) ;

	t( "ied"       , "i" ) ;
	t( "aing"      , "a" ) ;

	t( "caresses"  , "caress" ) ;
	t( "ponies"    , "poni" ) ;
	t( "ties"      , "ti" ) ;
	t( "caress"    , "caress" ) ;
	t( "cats"      , "cat" ) ;

	t( "feed"      , "feed" ) ;
	t( "agreed"    , "agre" ) ;
	t( "disabled"  , "disabl" ) ;

	t( "matting"   , "mat" ) ;
	t( "mating"    , "mate" ) ;
	t( "meeting"   , "meet" ) ;
	t( "milling"   , "mill" ) ;
	t( "messing"   , "mess" ) ;

	t( "meetings"  , "meet" ) ;

	t( "journalism" , "journal" ) ;

	t( "fossilization" , "fossil" ) ;
	t( "civilization" , "civil" ) ;

import reference from "../../data/stemming/porter/reference.js" ;

	reference.pairs.forEach( t.apply.bind( t , null ) ) ;

} ) ;
