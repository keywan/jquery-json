/**
 * jQuery JSON Plugin
 * version: 2.2 (2011-09-16)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */

(function( $ ) {
	/**
	 * jQuery.toJSON
	 * Converts the given argument into a JSON respresentation.
	 *
	 * @param o {Mixed} The json-serializble *thing* to be converted
	 *
	 * If an object has a "toJSON" function, that will be used to get the representation.
	 * Non-integer/string keys are skipped in the object, as are keys that point to a
	 * function.
	 *
	 */
	$.toJSON = function( o ) {
		if ( typeof JSON  === 'object' && JSON.stringify ) {
			return JSON.stringify( o );
		}

		var type = typeof o;

		if ( o === null ) {
			return 'null';
		}
		if ( type === 'undefined' ) {
			return undefined;
		}
		if ( type === 'number' || type === 'boolean' ) {
			return o + '';
		}
		if ( type === 'string') {
			return $.quoteString( o );
		}
		if ( type === 'object' ) {
			if ( typeof o.toJSON === 'function' ) {
				return $.toJSON( o.toJSON() );
			}
			if ( o.constructor === Date ) {
				var month = o.getUTCMonth() + 1;
				if ( month < 10 ) {
					month = '0' + month;
				}
				var day = o.getUTCDate();
				if ( day < 10 ) {
					day = '0' + day;
				}
				var year = o.getUTCFullYear();
				var hours = o.getUTCHours();
				if ( hours < 10 ) {
					hours = '0' + hours;
				}
				var minutes = o.getUTCMinutes();
				if ( minutes < 10 ) {
					minutes = '0' + minutes;
				}
				var seconds = o.getUTCSeconds();
				if ( seconds < 10 ) {
					seconds = '0' + seconds;
				}
				var milli = o.getUTCMilliseconds();
				if ( milli < 100 ) {
					milli = '0' + milli;
				}
				if ( milli < 10 ) {
					milli = '0' + milli;
				}
				return '"' + year + '-' + month + '-' + day + 'T' +
				hours + ':' + minutes + ':' + seconds +
				'.' + milli + 'Z"';
			}
			if ( o.constructor === Array ) {
				var ret = [];
				for ( var i = 0; i < o.length; i++ ) {
					ret.push( $.toJSON( o[i] ) || 'null' );
				}
				return '[' + ret.join(',') + ']';
			}
			var pairs = [];
			for ( var k in o ) {
				var name;
				var type = typeof k;
				if ( type === 'number' ) {
					name = '"' + k + '"';
				} else if (type === 'string') {
					name = $.quoteString(k);
				} else {
					//skip non-string or number keys
					continue;
				}

				if ( typeof o[k] === 'function' ) {
					//skip pairs where the value is a function.
					continue;
				}
				var val = $.toJSON( o[k] );
				pairs.push(name + ':' + val);
			}
			return '{' + pairs.join(', ') + '}';
		}
	};

	/**
	 * jQuery.evalJSON
	 * Evaluates a given piece of json source.
	 *
	 * @param src {String}
	 */
	$.evalJSON = function( src ) {
		if ( typeof JSON === 'object' && JSON.parse ) {
			return JSON.parse( src );
		}
		return eval('(' + src + ')');
	};

	/**
	 * jQuery.secureEvalJSON
	 * Evals JSON in a way that is *more* secure.
	 *
	 * @param src {String}
	 */
	$.secureEvalJSON = function( src ) {
		if ( typeof JSON === 'object' && JSON.parse ) {
			return JSON.parse( src );
		}

		var filtered = src;
		filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
		filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
		filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if ( /^[\],:{}\s]*$/.test( filtered ) ) {
			return eval('(' + src + ')');
		} else {
			throw new SyntaxError( 'Error parsing JSON, source is not valid.' );
		}
	};

	var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
	var _meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	};

	/**
	 * jQuery.quoteString
	 * Returns a string-repr of a string, escaping quotes intelligently.
	 * Mostly a support function for toJSON.
	 * Examples:
	 * >>> jQuery.quoteString('apple')
	 * "apple"
	 *
	 * >>> jQuery.quoteString('"Where are we going?", she asked.')
	 * "\"Where are we going?\", she asked."
	 */
	$.quoteString = function( string ) {
		if ( string.match( _escapeable ) ) {
			return '"' + string.replace( _escapeable, function( a ) {
				var c = _meta[a];
				if ( typeof c === 'string' ) {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + string + '"';
	};

})( jQuery );