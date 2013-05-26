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
(function() {
	"use strict";

	$namespace.register("joopl.collections", function () {
	    var collections = this;

		this.IndexedList = $def({
			$extends: collections.ObservableList,
			$constructor: function (args) {
			    this.$base.$ctor(args);

			    this.$_.indexes = new collections.List();
			    this.changed = this.list_changed;
			},
			$members: {
				add: function(item) {
					this.$base.add(item);
				},

				addIndex: function(index) {
					if(index.isTypeOf(collections.Index)) {
						this.$_.indexes.add(index);
					} else {
						throw new $global.joopl.ArgumentException({
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
							throw new $global.joopl.ArgumentException({
								argName: "predicateFuncOrIndexedSearch",
								reason: "The indexed search requires a property selector"
							});
						}

						var propertyName = parameters[0];
						var index = this.$_.indexes.single(function(index) { return index.property == propertyName; });

						return isIndexedFunc(index, propertySelector, predicateFunc);
					}
				},

				where: function(predicateFuncOrIndexedSearch) {
					var that = this;

					return this.decideIndexOrSequence(
						predicateFuncOrIndexedSearch,
						function(index, propertySelector, predicateFunc) {
							return index.where(propertySelector, predicateFunc);
						},
						function() {
							return that.$base.where(predicateFuncOrIndexedSearch);
						}
					);
				},

			    list_changed: function(args) {
			    	this.$_.indexes.forEach(function(index) {
			    		index.onDataChange(args);
			    	});
			    }
			}
		});
	});
})();