/*
 *   Funzioni Utilità per lo svolgimento più pratico delle Attività
 *
 *
 */

bogu.module("$common", function() {
	function _startsWith(str, val, ignoreCase) {
		if (typeof(str) !== "string" || typeof(val) !== "string") {
			return false;
		} else {

			if (ignoreCase) {
				str = str.toLowerCase();
				val = val.toLowerCase();
			}

			return str.slice(0, val.length) === val;
		}
	};

	function _unique(ary) {
		var aryCopied = ary.concat();
		aryCopied.forEach(function(item, index) {
			for (var i = index + 1; i < aryCopied.length; ++i) {
				if (item == ary[i]) {
					ary.splice(i--, 1);
				}
			}
		});

		return ary;
	};

	function _isUndefOrNull(obj) {
		return obj === undefined || obj === null;
	}

	function _defer(fnToDefer) {
		_delay.apply(null, [0, fnToDefer].concat(Array.prototype.slice.call(arguments, 1)));
	}

	function _delay(delay, fnToDelay) {
		var fnArgs = Array.prototype.slice.call(arguments, 2);
		setTimeout(function() {
			return fnToDelay.apply(null, fnArgs);
		}, delay);
	}

	function _extend() {
		var destination = arguments[0];
		var source = arguments[1];

		for (var key in source) {
			if (source[key] !== null && typeof(source[key]) === "object") {
				if (Array.isArray(source[key])) {
					destination[key] = source[key].slice();
				} else {
					destination[key] = {};
					_extend(destination[key], source[key]);
				}
			} else {
				destination[key] = source[key];
			}
		}

		return destination;
	}

	return {
		startsWith: _startsWith,
		unique: _unique,
		isUndefOrNull: _isUndefOrNull,
		delay: _delay,
		defer: _defer,
		extend: _extend
	};
});