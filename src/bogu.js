(function(scope, factory) {
	scope.bogu = factory();
})(this, function() {

	function domCompiler(bogu) {
		var elementsToParse = document.querySelectorAll("[data-view]");
		console.log(elementsToParse.length);
		for (var i = 0; i < elementsToParse.length; ++i) {
			var element = elementsToParse[i];
			var viewName = element.dataset.view;
			var viewModelName = viewName + "Model";

			bogu.module([viewModelName], function(viewModel) {
				var bindElements = element.querySelectorAll("[data-bind]");
				for (var j = 0; j < bindElements.length; ++j) {
					var bindElement = bindElements[j];
					viewModel.on(bindElements[j].dataset.bind, function(newVal, oldVal){
						bindElement.textContent = newVal;
					});
					bindElement.textContent = viewModel[bindElements[j].dataset.bind];
				}

				var commandElements = element.querySelectorAll("[data-command-click]");
				for (var k = 0; k< commandElements.length; ++k){
					console.log(JSON.stringify(commandElements[k].dataset));
					var func = new Function("viewModel", "with(viewModel) {" + commandElements[k].dataset.commandClick + "}");

					commandElements[k].addEventListener("click", function(){ func(viewModel); });
				}
			});
		}
	}

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
			},
			enumerable: true
		},
		viewModel: {
			value: function(name, dependencies, factory) {
				if (arguments.length < 2 || arguments.length > 3) {
					throw new Error("Invalid number of arguments calling viewModel function");
				}
				if (typeof(arguments[0]) !== "string") {
					throw new Error("calling viewModel function first argument must be viewModel name");
				}

				if (arguments.length === 2) {
					factory = dependencies;
					dependencies = [];
				}

				this.module(name, ["$observer"].concat(dependencies), function() {
					var _observer = arguments[0];
					var viewModel = factory(dependencies);
					_observer.makeObservable(viewModel);
					return viewModel;
				});
			},
			enumerable: true
		},
		run: {
			value: function() {
				var self = this;
				if (document.readyState == "interactive") {
					domCompiler(self);
				} else {
					document.onreadystatechange = function(e) {
						if (document.readyState == "interactive") {
							domCompiler(self);
						}
					}
				}
			},
			enumerable: true
		}
	});
	return new bogu();
});