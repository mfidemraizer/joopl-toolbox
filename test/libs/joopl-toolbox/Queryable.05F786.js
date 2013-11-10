(function() {
    "use strict";

    /**
		@namespace joopl.collections
    */

	$namespace.register("joopl.collections", function() {
		var collections = this;

		/**
			Represents an enumerable which defers certain operations until the enumerable is iterated.

			@class Queryable
			@extends joopl.collections.Enumerable
			@final
			@constructor
			@param {joopl.collections.Enumerable} enumerable The enumerable to manage and defer some operations
		*/
		this.declareClass("Queryable", {
			inherits: this.Enumerable,
			ctor: function(args) {
				if(typeof args != "object") {
					throw new $global.joopl.ArgumentException({
						argName: "args",
						reason: "Queryable does not have a parameterless constructor"
					});
				}

				this._.executionQueue = new collections.Queue();
				this._.enumerable = args.enumerable;
			},
			members: {
				get enumerator() { 
					return this.enumerable.enumerator;
				},
				
				get enumerable() { 
					return this._.enumerable; 
				},

				/**
					Gets execution queue. This is used by the `Queryable` in order to enqueue defered operations.

					@property executionQueue
					@private
					@readOnly
					@type joopl.collections.Queue
				*/
				get executionQueue() { 
					return this._.executionQueue; 
				},

				/**
					Executes enqueued defered operations and returns the result of chained execution

					@method executeQueue
					@private
					@return {object|null} Returns the result of executing the defered operations if the execution of the whole queue returns something
				*/
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

					return result !== null ? result : this.enumerable;
				},

				reverse: function() {
					var result = this.executeQueue();

					return result.reverse();
				},

				single: function(predicateFunc) {
					var result = this.executeQueue();

					return result.single(predicateFunc);
				},

				singleOrNull: function(predicateFunc) {
					var result = this.executeQueue();

					return result.singleOrNull(predicateFunc);
				},

				first: function(predicateFunc) {
					var result = this.executeQueue();

					return result.first(predicateFunc);
				},

				firstOrNull: function(predicateFunc) {
					var result = this.executeQueue();

					return result.firstOrNull(predicateFunc);
				},

				last: function(predicateFunc) {
					var result = this.executeQueue();

					return result.last(predicateFunc);
				},

				lastOrNull: function(predicateFunc) {
					var result = this.executeQueue();

					return result.lastOrNull(predicateFunc);
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
						list.addRange(this);
					} else {
						list.addRange(this.executeQueue());
					}

					return list;
				}
			}
		});
	});
})();
