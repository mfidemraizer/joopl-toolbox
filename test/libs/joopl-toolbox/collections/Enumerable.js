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
(function () {
    "use strict";

    $manifest.file("collections/Enumerable.js");

	$namespace.register("joopl.collections", function() {
		var collections = this;

		this.Enumerable = $def({
			$members: {
				get enumerator() {
					throw new $global.joopl.NotImplementedException();
				},

				reverse: function() {
					throw new $global.joopl.NotImplementedException();
				},

				forEach: function(predicateFunc) {
					var enumerator = this.$_.$derived.enumerator;

					while(enumerator.hasNext()) {
						var item = enumerator.moveNext();

						predicateFunc(item);
					}

					return this;
				},

				singleOrNull: function(predicateFunc) {
				    var result = this.where(predicateFunc);

				    if (result.count() > 1) {
				        debugger;
				        throw new $global.joopl.InvalidOperationException({
                            message: "Sequence contains more than one element"
				        });
				    }

				    return result.firstOrNull();
				},

				single: function(predicateFunc) {
				    var result = this.singleOrNull(predicateFunc);

				    if (result === null) {
				        debugger;
				        throw new $global.joopl.InvalidOperationException({
				            message: "Sequence contains no elements"
				        });
				    }

				    return result;
				},

				firstOrNull: function (predicateFunc) {
				    var enumerator = this.$_.$derived.enumerator;
				    var found = false;
				    var foundItem = null;

				    if (predicateFunc) {
				        while (!found && enumerator.hasNext()) {
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

				first: function (predicateFunc) {
				    var foundItem = this.firstOrNull(predicateFunc);

					if (foundItem !== null) {
					    return foundItem;
					} else {
					    debugger;
					    throw new $global.joopl.InvalidOperationException({ message: "Sequence contains no elements" });
					}
				},

				last: function(predicateFunc) {
					var reversed = this.$_.$derived.reverse();

					return reversed.first(predicateFunc);
				},

				lastOrNull: function (predicateFunc) {
				    var reversed = this.$_.$derived.reverse();

				    return reversed.firstOrNull(predicateFunc);
				},

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

				where: function(predicateFunc) {
					if(!(predicateFunc instanceof Function)) {
						throw new $global.joopl.ArgumentException({
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

				select: function(predicateFunc) {
					if(!(predicateFunc instanceof Function)) {
						throw new $global.joopl.ArgumentException({
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

				asQueryable: function() {
					return new collections.Queryable({ enumerable: this });
				}
			}
		});
	});
})();