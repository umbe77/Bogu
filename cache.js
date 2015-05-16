/*
 *
 *	Gestione della Cache
 *
 */
bogu.module("$cache", function() {
	function Cache(cacheId) {
		this.cacheId = cacheId;
	}

	Cache.prototype = Object.create(Object.prototype, {
		cacheId: {
			value: "",
			writable: false
		},
		add: {
			value: function(key, value) {
				this[key] = value;
			},
			enumerable: true
		},
		remove: {
			value: function(key) {
				delete this[key];
			},
			enumerable: true
		},
		removeAll: {
			value: function(){
				for(var key in this){
					if (key !== "cacheId"){
						delete this[key];
					}
				}
			},
			enumerable: true
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
			},
			enumerable: true
		}
	});

	var _caches = {};
	function CacheFactory(cacheId){
		if (!cacheId){
			cacheId = "DEFAULT_CACHE";
		}

		if (!_caches[cacheId]){
			_caches[cacheId] = new Cache(cacheId);
		}

		return _caches[cacheId];
	}

	return CacheFactory;
});