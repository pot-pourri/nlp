

var ngrams = function ( n, tokens, out ) {

	var i, j, len, gram;

	len = tokens.length - n;

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
