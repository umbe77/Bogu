/*
*
*   Gestione delle promesse
*
*
*/

bogu.module("$d", ["$common"], function ($common)
{
	function Promise()
	{
		this.$$resolvedCallbacks = [];
		this.$$rejectedCallbacks = [];
	}

	Promise.prototype = Object.create(Object.prototype, {
		$$resolvedCallbacks: {
			value: null,
			writable: true
		},
		$$rejectedCallbacks: {
			value: null,
			writable: true
		},
		$$status: {
			value: "pending",
			writable: true
		},
		$$data: {
			value: null,
			writable: true
		},
		then: {
			value: function (resolvedCallback, rejectedCallback)
			{
				var defer = new Deferred();

				this.$$resolvedCallbacks.push({
					cb: resolvedCallback,
					defer: defer
				});

				if (rejectedCallback)
				{
					this.$$rejectedCallbacks.push({
						cb: rejectedCallback,
						defer: defer
					});
				}

				if (this.$$status === "resolved")
				{
					this.$$executeCallback({
						cb: resolvedCallback,
						defer: defer
					}, this.$$data);
				}
				else if (this.$$status === "rejected")
				{
					this.$$executeCallback({
						cb: rejectedCallback,
						defer: defer
					}, this.$$data);

				}

				return defer.promise;
			},
			enumerable: true
		},
		$$executeCallback: {
			value: function (cbObj, data)
			{
				$common.defer(function ()
				{
					if (cbObj.cb)
					{
						var result = cbObj.cb(data);
						if (result instanceof Promise)
						{
							cbObj.defer.$$propagate(result);
						}
						else
						{
							cbObj.defer.resolve(result);
						}
					}
				});
			}
		}
	});

	function Deferred()
	{
		this.promise = new Promise();
	}

	Deferred.prototype = Object.create(Object.prototype, {
		promise: {
			value: null,
			enumerable: true,
			writable: true
		},
		resolve: {
			value: function (data)
			{
				var _self = this;
				this.promise.$$status = "resolved";
				this.promise.$$data = data;
				this.promise.$$resolvedCallbacks.forEach(function (cb, index)
				{
					_self.promise.$$executeCallback(cb, data);
				});
			},
			enumerable: true
		},
		reject: {
			value: function (error)
			{
				var _self = this;
				this.promise.$$status = "rejected";
				this.promise.$$data = error;
				this.promise.$$rejectedCallbacks.forEach(function (cb, index)
				{
					_self.promise.$$executeCallback(cb, error);
				});
			},
			enumerable: true
		},
		$$propagate: {
			value: function (promise)
			{
				var _self = this;
				promise.then(function (data)
				{
					_self.resolve(data);
				},
				function (error)
				{
					_self.reject(error);
				});
			}
		}
	});

	return {
		deferred: function ()
		{
			return new Deferred();
		},
		all: function (promises)
		{
			//Impostare una coda per la gestione delle promesse
			//andare nella funzione di resolve se tutte risolte
			//se una solo è rejected allora andare in rejected
			//come prima versione arrivo comunque in fondo a tutte le chiamate
			//		Se ci sono dei reject li passo tutti nella funzione di errore

			function checkEnd()
			{
				if (allPromisesEnd.length === totalPromises)
				{
					if (resolvedPromises.length === totalPromises)
					{
						df.resolve(resolvedPromises);
					}
					else
					{
						df.reject(rejectedPromises);
					}
				}
			}

			var df = new Deferred();

			var resolvedPromises = [];
			var rejectedPromises = [];
			var allPromisesEnd = [];
			var totalPromises = promises.length;

			promises.forEach(function (promise, index)
			{
				promise.then(function (data)
				{
					resolvedPromises.splice(index, 0, data)
					allPromisesEnd.push(data);
					checkEnd();
				},
				function (error)
				{
					rejectedPromises.splice(index, 0, error);
					allPromisesEnd.push(error);
					checkEnd();
				});
			})


			return df.promise;
		}
	}
});