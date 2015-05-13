(function(scope, factory) {
	scope.bogu = factory();
})(this, function() {
	function bogu() {}

	bogu.prototype = Object.create(Object.prototype, {
		$$modules: {
			value: {},
			writable: true,
			enumerable: false
		},
		module: {
			value: function(name, dependencies, factory) {
				/*Impostazioni per la registrazione del modulo tra le dipendenze.*/
				if (arguments.length < 1 || arguments.length > 3) {
					throw new Error("Invalid number of argument calling module function");
				}
				if (arguments.length == 1) {
					factory = name;
				} else if (arguments.length == 2) {
					if (Array.isArray(name)) {
						factory = dependencies;
						dependencies = name;
						name = undefined;
					} else {
						factory = dependencies;
						dependencies = [];
					}
				} else {
					if (!dependencies) {
						dependencies = [];
					}
				}
				/*Impostazioni per lesecuzione del modulo.*/
				var args = [];
				for (var i = 0; i < dependencies.length; ++i) {
					var dep = dependencies[i];
					if (this.$$modules[dep]) {
						args.push(this.$$modules[dep].factory);
					} else {
						throw new Error("Dependency " + dep + " not found");
					}
				};
				var mod = factory.apply(factory, args);

				if (name && !this.$$modules[name]) {
					this.$$modules[name] = {
						factory: mod
					}
				}
				return mod;
			}
		}
	});
	return new bogu();
});