/*
 *
 *	Gestione della Cache
 *
 */
bogu.module("$cache", function() {
	function Cache() {}

	Cache.prototype = Object.create(Object.prototype, {
		add: {
			value: function(key, value) {
				this[key] = value;
			},
			enumerable: true
		},
		remove: {
			value: function(key) {
				delete this[key];
			}
		},
		forEach: {
			value: function(callback) {
				if (callback) {
					for (var key in this) {
						if (!callback(key, this[key])){
							break;
						}
					}
				}
			}
		}
	});

	return new Cache();
});