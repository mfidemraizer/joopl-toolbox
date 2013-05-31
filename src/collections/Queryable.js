(function() {
	"use strict";

	$namespace.register("joopl.collections", function() {
		var collections = this;

		this.Queryable = $def({
			$extends: this.Enumerable,
			$constructor: function(args) {
				if(typeof args != "object") {
					throw new $global.joopl.ArgumentException({
						argName: "args",
						reason: "Queryable does not have a parameterless constructor"
					});
				}

				this.$_.executionQueue = new collections.Queue();
				this.$_.enumerable = args.enumerable;
			},
			$members: {
				get enumerator() { return this.enumerable.enumerator; },

				get executionQueue() { return this.$_.executionQueue; },
				get enumerable() { return this.$_.enumerable; },

				executeQueue: function() {
					var queuedItem = null;
					var queuedMethod = null;
					var result = null;

					while(this.executionQueue.count() > 0) {
						queuedItem = this.executionQueue.dequeue();

						if(result === null) {
							queuedMethod = this.enumerable[queuedItem.method].bind(this.enumerable);
						} else {
							queuedMethod = result[queuedItem.method].bind(result);
						}

						if(queuedItem.predicateFunc instanceof Function) {
							result = queuedMethod(queuedItem.predicateFunc);
						} else {
							result = queuedMethod();
						}
					}

					return result;
				},

				where: function(predicateFunc) {
					this.executionQueue.enqueue({
						method: "where",
						predicateFunc: predicateFunc
					});

					return this;
				},

				select: function(predicateFunc) {
					this.executionQueue.enqueue({
						method: "select",
						predicateFunc: predicateFunc
					});

					return this;
				},

				forEach: function(predicateFunc) {
					var result = this.executeQueue();

					return result.forEach(predicateFunc);
				},

				toList: function() {
					var list = new collections.List();

					if(this.executionQueue.count() == 0) {
						list.addRange(this.enumerable);
					} else {
						list.addRange(this.executeQueue());
					}

					return list;
				}
			}
		});
	});
})();