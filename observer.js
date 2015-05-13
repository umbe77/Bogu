/*
 *
 * Metodi per creare Oggetti di tipo Observable Utile per la gestione delle interfacce
 *
 */

bogu.module("$observer", ["$common"], function($common) {
	/* Rilancia tutti i setter dell'observable passato in questo riapplicando gli observer definiti */
	function fireAllObserver(observable) {
		Object.getOwnPropertyNames(observable).forEach(function(property, index) {
			if (!$common.startsWith(property, "$$") && property !== "isObservable" && typeof(observable[property]) !== "function") {
				fireSetter(observable, property, observable[property]);
			}
		});
	}

	/* Crea una property osservabile */
	function makeObservableProperty($this, item) {
		var val = $this[item];
		if (typeof(val) === "object") {
			if (Array.isArray(val) && !val.isObservableArray) {
				val = new ObservableArray(val);
			}
			makeObservable(val);
		}

		Object.defineProperty($this, "$$" + item, {
			value: val,
			//configurable: true,
			writable: true
		});

		//$this["$$" + item] = val;

		Object.defineProperty($this, item, {
			enumerable: true,
			configurable: true,
			get: function() {
				return $this["$$" + item];
			},
			set: function(value) {
				fireSetter($this, item, value);
			}
		});
	}

	function fireObservers($this, prop, newValue, oldValue) {
		var observers = $this.$$__observers.filter(function(observer) {
			return (observer.prop === prop && observer.active);
		});

		if (observers.length === 0) return true;

		return observers.every(function(observer, index) {
			//console.log("RUN SET Observer");
			var ret = observer.cb(newValue, oldValue);
			return (ret === undefined || ret === null || ret)
		});

	}

	/* function che esegue il setter delle property observable */
	function fireSetter($this, item, value) {
		////console.log("SET " + item);
		var oldValue = $this["$$" + item];
		var newValue = value;

		if (fireObservers($this, item, newValue, oldValue)) {
			if (Array.isArray(value) && !value.isObservableArray) {
				value = new ObservableArray(value);
			}
			makeObservable(value);
			$this["$$" + item] = value;
			if (!$common.isUndefOrNull(value["$$__observers"])) {
				value.$$__observers = $common.unique(value.$$__observers.concat(oldValue.$$__observers));
				//rilanciare a cascata tutti gli observer dl nuovo oggetto
				fireAllObserver(value);
			}
		}
	};

	/* Rimuove un observer dalla lista */
	function removeObserver($this, index) {
		$this.$$__observers.splice(index, 1);
	}

	/* Crea un oggetto Observable */
	function makeObservable(obj) {
		var $this = obj;
		if (!$this.$$__observable && typeof($this) === "object") {
			if (Array.isArray($this)){
				$this = new ObservableArray(obj);
			}

			Object.defineProperty($this, "$$__observers", {
				value: [],
				writable: true
			});

			Object.defineProperty($this, "$$__observable", {
				value: true,
				writable: true
			});

			Object.defineProperty($this, "addObservableProperty", {
				value: function(name, val){
					if (!this[name]){
						this[name] = val;
						makeObservableProperty($this, name);
					}
				}
			});

			$this.on = function(name, property, callback) {
				if (arguments.length === 2) {
					callback = property;
					property = name;
					name = null;
				}

				$this.$$__observers.push({
					prop: property,
					cb: callback,
					name: name,
					active: true
				});

			};

			$this.off = function(property, name) {
				$this.$$__observers.forEach(function(observer, index) {
					var matchedIndex = -1;
					if (property === observer.prop) {
						if (!$common.isUndefOrNull(name) && name !== "") {
							if (name === observer.name) {
								matchedIndex = index;
							}
						} else {
							matchedIndex = index;
						}
					}

					if (matchedIndex !== -1) {
						removeObserver($this, matchedIndex);
					}
				});
			}

			$this.offAll = function() {
				$this.$$__observers = null;
				$this.$$__observers = [];
			}

			Object.getOwnPropertyNames($this).forEach(function(item, index) {
				if (typeof($this[item]) !== "function" && !$common.startsWith(item, "$$")) {
					if (Object.getOwnPropertyDescriptor($this, item).configurable) {
						makeObservableProperty($this, item);
					}
				}
			});

			Object.defineProperty($this, "isObservable", {
				enumerable: false,
				configurable: true,
				get: function() {
					return $this.$$__observable;
				}
			});
		}

		return $this;
	};


	//Sottoclasse di Array
	function ObservableArray() {

		this.forEach(function(item) {
			makeObservable(item);
		})

		this.$$addRange(arguments[0]);

		Object.defineProperty(this, "isObservableArray", {
			value: true,
			enumerable: true,
			configurable: false,
			writable: false
		});
	}

	ObservableArray.prototype = Object.create(Array.prototype, {
		$$addRange: {
			value: function(items) {
				Array.prototype.push.apply(this, items);
			},
			enumerable: false,
			configurable: false,
			writable: true
		},
		$$makeAccessObservable: {
			value: function(oldLength) {
				var lengthGap = this.length - oldLength;
				if (lengthGap > 0) {
					for (var i = 0; i < lengthGap; ++i) {
						makeObservableProperty(this, (oldLength + i).toString());
					}
				}
			}
		},
		addRange: {
			value: function(items) {
				if (fireObservers(this, "change", items, [])) {
					var oldLength = this.length;
					this.$$addRange(items);
					this.$$makeAccessObservable(oldLength);
				}
			},
			enumerable: true,
			configurable: true,
			writable: true
		},
		push: {
			value: function() {
				var inserted = Array.prototype.slice.call(arguments);
				var deleted = [];

				if (fireObservers(this, "change", inserted, deleted)) {
					var oldLength = this.length;
					Array.prototype.push.apply(this, arguments);
					this.$$makeAccessObservable(oldLength);
				}
			},
			enumerable: true,
			configurable: true,
			writable: true
		},
		pop: {
			value: function(item) {
				var inserted = [];
				var deleted = [this[this.length - 1]];
				if (fireObservers(this, "change", inserted, deleted)) {
					return Array.prototype.pop.apply(this);
				}
				return undefined;
			},
			enumerable: true,
			configurable: true,
			writable: true
		},
		shift: {
			value: function() {
				var inserted = [];
				var deleted = [this[0]];

				if (fireObservers(this, "change", inserted, deleted)) {
					return Array.prototype.shift.apply(this);
				}
				return undefined;
			},
			enumerable: true,
			configurable: true,
			writable: true
		},
		unshift: {
			value: function() {
				var inserted = Array.prototype.slice.call(arguments);
				var deleted = [];

				if (fireObservers(this, "change", inserted, deleted)) {
					var oldLength = this.length;
					Array.prototype.unshift.apply(this, arguments);
					this.$$makeAccessObservable(oldLength);
				}
			},
			enumerable: true,
			configurable: true,
			writable: true
		},
		splice: {
			value: function() {
				var args = Array.prototype.slice.call(arguments);
				var inserted = [];
				var deleted = [];
				if (args[1] > 0) {
					deleted = Array.prototype.slice.apply(this, [args[0], (args[0] + args[1])]);
				}
				if (args.length > 2) {
					inserted = args.slice(2);
				}
				if (fireObservers(this, "change", inserted, deleted)) {
					var oldLength = this.length;
					Array.prototype.splice.apply(this, arguments);
					this.$$makeAccessObservable(oldLength);
				}
			},
			enumerable: true,
			configurable: true,
			writable: true
		},
		toJSON: {
			value: function() {
				return Array.prototype.slice.call(this);
			},
			enumerable: true,
			configurable: true,
			writable: true
		}
	});

	return {
		makeObservable: makeObservable
	};
});