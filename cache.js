/*
 *
 *	Gestione della Cache
 *
 */
bogu.module("$cache", function() {
	function Cache(cacheId) {
		this.$$cacheId = cacheId;
	}

	Cache.prototype = Object.create(Object.prototype, {
		$$cacheId: {
			value: "",
			writable: true
		},
		cacheId: {
			get: function() {
				return this.$$cacheId;
			},
			enumerable: true
		},
		$$size: {
			value: 0,
			writable: true
		},
		size: {
			get: function() {
				return this.$$size;
			},
			enumerable: true
		},
		add: {
			value: function(key, value) {
				if (!this[key]) {
					this.$$size++;
				}
				this[key] = value;

			},
			enumerable: true
		},
		remove: {
			value: function(key) {
				delete this[key];
				this.$$size--;
			},
			enumerable: true
		},
		removeAll: {
			value: function() {
				for (var key in this) {
					if (key !== "cacheId") {
						delete this[key];
					}
				}
				this.$$size = 0;
			},
			enumerable: true
		},
		forEach: {
			value: function(callback) {
				if (callback) {
					for (var key in this) {
						if (!callback(key, this[key])) {
							break;
						}
					}
				}
			},
			enumerable: true
		}
	});

	var _caches = {};

	function CacheFactory(cacheId) {
		if (!cacheId) {
			cacheId = "DEFAULT_CACHE";
		}

		if (!_caches[cacheId]) {
			_caches[cacheId] = new Cache(cacheId);
		}

		return _caches[cacheId];
	}

	CacheFactory.destroy = function(cacheId) {
		_caches[cacheId] = null;
		delete _caches[cacheId];

	}

	return CacheFactory;
});