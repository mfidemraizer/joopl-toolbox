/*
 Copyright Matias Fidemraizer
 http://matiasfidemraizer.com
 http://www.linkedin.com/in/mfidemraizer/en

 jOOPL Toolbox
 https://github.com/mfidemraizer/joopl-toolbox

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
    /**
		@namespace joopl.collections
    */

$namespace.using("joopl", "joopl.collections", function(joopl, collections) {
	var collections = this;

	/** 
		Represents an abstract object that is able of being enumerated using supported iterators.
		
		@class Enumerable
	*/
	collections.declareClass("Enumerable", {
		members: {
			/**
				Inherited classes return an instance of enumerable-specific enumerator.

				@property enumerator
				@type joopl.collections.Enumerator
				@readonly
			*/
			get enumerator() {
				throw new new joopl.NotImplementedException({ memberName: "enumerator" });
			},

			/**
				Inherited classes return an enumerable holding same items in the sequence as current
				one but in the reversed order.

				@method reverse
				@returns joopl.collections.Enumerable
			*/
			reverse: function() {
				throw new joopl.NotImplementedException({ memberName: "Enumerable.reverse" });
			},

			/**
				Executes an action defined by a predicate function for each item in the enumerable sequence.

				@method forEach
				@param {Function} predicateFunc An action to perform for each item in the enumerable sequence
				@returns void
				@example
					enumerable.forEach(function(item) {
						// Do stuff here
					});
			*/
			forEach: function(predicateFunc) {
				var enumerator = this._.derived.enumerator;
				var end = false;

				while(!end && enumerator.hasNext) {
					var item = enumerator.moveNext();

					end = item === undefined;

					if(!end) {
						predicateFunc(item);
					}
				}

				return this;
			},

			/**
				Retrieves an unique item in the sequence. If there are no elements, returns `null`,

				Optionally, it can take a predicate function as argument returning a boolean in order to
				specify how to determine the singleness of the searched item.

				@method singleOrNull 
				@returns object
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy the single item
				@example
					var result = enumerable.singleOrNull(function(item) {
						return item == "hello world";
					});

					var result2 = enumerable.singleOrNull();
			*/
			singleOrNull: function(predicateFunc) {
			    var result = this.where(predicateFunc);

			    if (result.count() > 1) {
			        throw new joopl.InvalidOperationException({
                        message: "Sequence contains more than one element"
			        });
			    }

			    return result.firstOrNull();
			},

			/**
				Retrieves an unique item in the sequence. If there are no elements, throws an `InvalidOperationException`,

				Optionally, it can take a predicate function as argument returning a boolean in order to
				specify how to determine the singleness of the searched item.

				@method singleOrNull 
				@returns object
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy the single item
				@example
					var result = enumerable.single(function(item) {
						return item == "hello world";
					});

					var result = enumerable.single();
			*/
			single: function(predicateFunc) {
			    var result = this.singleOrNull(predicateFunc);

			    if (result === null) {
			        throw new joopl.InvalidOperationException({
			            message: "Sequence contains no elements"
			        });
			    }

			    return result;
			},

			/**
				Retrieves first item in the sequence. If there are no elements, returns null,

				Optionally, it can take a predicate function as argument returning a boolean in order to
				specify what criteria should conform first item in the sequence.

				@method firstOrNull 
				@returns object
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy the single item
				@example
					var result = enumerable.firstOrNull(function(item) {
						return item == "hello world";
					});

					var result = enumerable.firstOrNull();
			*/
			firstOrNull: function (predicateFunc) {
			    var enumerator = this._.derived.enumerator;
			    var found = false;
			    var foundItem = null;

			    if (predicateFunc) {
			        while (!found && enumerator.hasNext) {
			            var item = enumerator.moveNext();

			            found = predicateFunc(item);
			        }

			        if (found) {
			            foundItem = item;
			            found = true;
			        }
			    } else {
			        foundItem = enumerator.moveNext();
			        found = foundItem != undefined;
			    }

			    if (found) {
			        return foundItem;
			    } else {
			        return null;
			    }
			},

			/**
				Retrieves first item in the sequence. If there are no elements, throws an `InvalidOperationException`,

				Optionally, it can take a predicate function as argument returning a boolean in order to
				specify what criteria should conform first item in the sequence.

				@method first
				@returns object
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy the single item
				@example
					var result = enumerable.first(function(item) {
						return item == "hello world";
					});

					var result = enumerable.first();
			*/
			first: function (predicateFunc) {
			    var foundItem = this.firstOrNull(predicateFunc);

				if (foundItem !== null) {
				    return foundItem;
				} else {
				    throw new joopl.InvalidOperationException({ message: "Sequence contains no elements" });
				}
			},

			/**
				Retrieves last item in the sequence. If there are no elements, returns null,

				Optionally, it can take a predicate function as argument returning a boolean in order to
				specify what criteria should conform last item in the sequence.

				@method last 
				@returns object
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy the last item search
				@example
					var result = enumerable.lastOrNull(function(item) {
						return item == "hello world";
					});

					var result = enumerable.lastOrNull();
			*/
			lastOrNull: function (predicateFunc) {
			    var reversed = this._.derived.reverse();

			    return reversed.firstOrNull(predicateFunc);
			},

			/**
				Retrieves last item in the sequence. If there are no elements, throws an `InvalidOperationException`,

				Optionally, it can take a predicate function as argument returning a boolean in order to
				specify what criteria should conform last item in the sequence.

				@method lastOrNull
				@returns object
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy the last item search
				@example
					var result = enumerable.last(function(item) {
						return item == "hello world";
					});

					var result = enumerable.last();
			*/
			last: function(predicateFunc) {
				var reversed = this._.derived.reverse();

				return reversed.first(predicateFunc);
			},

			/**
				Counts items in the sequence.

				Optionally, it can take a predicate function as argument returning a boolean in order to specify what criteria should conform 
				each item to be counted in the sequence.

				@method count
				@returns number
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy the last item search
				@example
					var result = enumerable.count(function(item) {
						return item == "hello world";
					});

					var result = enumerable.count();

			*/
			count: function(predicateFunc) {
				var count = 0;

				if(predicateFunc instanceof Function) {
					this.forEach(function(item) {
						if(predicateFunc(item)) {
							count++;
						}
					});
				} else {
					this.forEach(function(item) {
						count++;
					});
				}

				return count;
			},

			/**
				Returns items that conform a boolean condition.

				@method where
				@return joopl.collections.Enumerable An `Enumerable` containing found items
				@param {Function} predicateFunc A predicate function which provides a boolean condition that must satisfy an item
				@example
					var result = enumerable.where(function(item) {
						return item == "hello world";
					});

			*/
			where: function(predicateFunc) {
				if(!(predicateFunc instanceof Function)) {
					throw new joopl.ArgumentException({
						argName: "predicateFunc",
						reason: "Given predicate function is not a function"
					});
				}

				var result = new $global.joopl.collections.List();

				this.forEach(function(item) {
					if(predicateFunc(item)) {
						result.add(item);
					}
				});

				return result;
			},

			/**
				Projects each item in the sequence. Item projection is defined by a predicate function.

				@method select
				@returns joopl.collections.Enumerable
				@param {Function} predicateFunc A predicate function which provides how to project each item
				@example
					var result = enumerable.select(function(item) {
						return { text: item };
					});

			*/
			select: function(predicateFunc) {
				if(!(predicateFunc instanceof Function)) {
					throw new joopl.ArgumentException({
						argName: "predicateFunc",
						reason: "Given predicate function is not a function"
					});
				}

				var result = new $global.joopl.collections.List();

				this.forEach(function(item) {
					result.add(predicateFunc(item));
				});

				return result;
			},

			skip: function(numberOfItems) {
				throw new joopl.NotImplementedException({ memberName: "Enumerable.skip" });
			},


			/**
				Returns a queryable object for the sequence.

				@method asQueryable
				@returns joopl.collections.Enumerable
				@param {Function} predicateFunc A predicate function which provides how to project each item
				@example
					var queryable = enumerable.asQueryable();

			*/
			asQueryable: function() {
				return new collections.Queryable({ enumerable: this });
			},

			/**
				Inherited classes returns items of this sequence as a standard JavaScript array object.

				@method toArray
				@returns Array
				@example
					var result = enumerable.toArray();

			*/
			toArray: function() {
				throw new joopl.NotImplementedException({ memberName: "Enumerable.toArray" });
			},

			/**
				Adds items in the enumerable to a `List` and returns it.

				@method toList
				@return {joopl.collections.List} A `List` containing current enumerable's items.
			*/
			toList: function() {
				var list = new collections.List();
				list.addRange(this);

				return list;
			}
		}
	});
});