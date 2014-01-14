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
$namespace.using("joopl", "joopl.collections", function (joopl, collections) {
    /**
		Represents an indexed collection of objects. Objects are indexed by configured indexes using `addIndex` method.

		@class IndexedList
		@extends joopl.collections.ObservableList
		@final 
    */
	collections.declareClass("IndexedList", {
		inherits: collections.ObservableList,
		ctor: function (args) {
		    this.base.ctor(args);

		    this._.indexes = new collections.List();
		    this.changed.addEventListener(this.list_changed.bind(this));
		},
		members: {
			get indexes() {
				return this._.indexes;
			},

			add: function(item) {
				this.base.add(item);
			},

			/**
				Adds and configures a new index to this `IndexedList`.

				@method addIndex
				@param {Index} index An implementation of `Index`.
			*/
			addIndex: function(index) {
				if(index.isTypeOf(collections.Index)) {
					this.indexes.add(index);
				} else {
					throw new joopl.ArgumentException({
						argName: "index",
						reason: "Given object is not an index"
					});
				}
			},

			decideIndexOrSequence: function(predicateFuncOrIndexedSearch, isIndexedFunc, isNonIndexedFunc) {
				if(predicateFuncOrIndexedSearch instanceof Function) {
					return isNonIndexedFunc();
				} else {
					var propertySelector = {};
					var predicateFunc = null;

					var parameters = Object.keys(predicateFuncOrIndexedSearch);

					if(typeof predicateFuncOrIndexedSearch[parameters[0]] != "function") {
						propertySelector[parameters[0]] = predicateFuncOrIndexedSearch[parameters[0]];
						predicateFunc = predicateFuncOrIndexedSearch[parameters[1]];
					} else if (typeof predicateFuncOrIndexedSearch[parameters[1]] == "function") {
						propertySelector = predicateFuncOrIndexedSearch[parameters[1]];
						predicateFunc = predicateFuncOrIndexedSearch[parameters[0]];
					} else {
						throw new joopl.ArgumentException({
							argName: "predicateFuncOrIndexedSearch",
							reason: "The indexed search requires a property selector"
						});
					}

					var propertyName = parameters[0];
					var index = this._.indexes.single(function(index) { 
						return index.property == propertyName; 
					});

					var result = new collections.List();

					var tempPropertyValue = null;

					for(var selectorIndex in propertySelector[index.property]) {
						tempPropertyValue = {};
						tempPropertyValue[index.property] = propertySelector[index.property][selectorIndex];

						result.addRange(isIndexedFunc(index, tempPropertyValue, predicateFunc));
					}

					return result;
				}
			},

			/**
				Returns items that conform a boolean condition.

				In opposite to regular `Enumerable.where(...)`, `IndexedList.where(...)` supports an indexed search 
				argument which specifies a property and a value to search for.

				@method where
				@return joopl.collections.Enumerable An `Enumerable` containing found items
				@example
	            var result = list.where({ 
	                text: ["hel", "w", "!" ], // <-- This is the property selector: search an item with this possible values
	                predicate: function(item) { 
	                	// "this" keyword will be one of possible "text" property values
	                	// so this condition says "I want an item if its "text" property is one of given possible values"
	                    return item.text.indexOf(this) == 0 || item.text == "halo"; 
	                } 
	            });
			*/
			where: function(predicateFuncOrIndexedSearch) {
				var that = this;

				return this.decideIndexOrSequence(
					predicateFuncOrIndexedSearch,
					function(index, propertySelector, predicateFunc) {
						return index.where(propertySelector, predicateFunc);
					},
					function() {
						return that.base.where(predicateFuncOrIndexedSearch);
					}
				);
			},

		    list_changed: function(args) {
		    	args.source._.indexes.forEach(function(index) {
		    		index.onDataChange(args);
		    	});
		    }
		}
	});
});