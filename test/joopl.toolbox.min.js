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

	$namespace.register("joopl.collections", function() {
	    this.InvalidOperationException = $def({
	        $extends: $global.joopl.Exception,
	        $constructor: function(args) {
	            this.$base.$ctor(args);
	        }
		});
	});
})();
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

	$namespace.register("joopl", function() {
		this.Convert = new ($def({
			$members: {
				toObject: function(value, throwOnNotSupported) {
					switch(typeof value) {
						case "number":
							return new Number(value);
						case "string":
							return new String(value);
						case "boolean":
							return new Boolean(value);
						default: 
							if(throwOnNotSupported) {
								throw new this.ArgumentException({
									argName: "value",
									reason: "Primitive type not supported"
								});
							} else {
								return value;
							}
					}
				} 
			}
		}));
	});
})();
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
	$namespace.register("joopl.collections", function() {
		this.Enumerator = $def({
			$members: {
				moveNext: function() {
					throw new $global.joopl.NotImplementedException();
				},
				hasNext: function() {
					throw new $global.joopl.NotImplementedException();
				}
			}
		});
	});
})();
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
	$namespace.register("joopl.collections", function() {
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
					var result = new $global.joopl.collections.List();

					this.forEach(function(item) {
						if(predicateFunc(item)) {
							result.add(item);
						}
					});

					return result;
				}
			}
		});
	});
})();
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
	
	$namespace.register("joopl.collections", function() {
		this.ListEnumerator = $def({
			$constructor: function(args) {
				this.$_.itemArray = args.itemArray;
				this.$_.index = -1;
			},
			$extends: this.Enumerator,
			$members: {
				moveNext: function() {
					return this.$_.itemArray[++this.$_.index];
				},

				hasNext: function() {
					return this.$_.index + 1 < this.$_.itemArray.length;
				}
			}
		});
	});
})();
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

	$namespace.register("joopl.collections", function() {
		this.List = $def({
			$extends: this.Enumerable,
			$constructor: function(args) {
				this.$_.itemArray = [];
			},
			$members: {
				get enumerator() {
					return new $global.joopl.collections.ListEnumerator({ itemArray: this.$_.itemArray });
				},

				reverse: function(predicateFunc) {
					var reversed = this.$_.itemArray.slice().reverse();

					var reversedList = new $global.joopl.collections.List();

					for(var index = 0; index < reversed.length; index++) {
						reversedList.add(reversed[index]);
					}

					return reversedList;
				},

				count: function(predicateFunc) {
					if(predicateFunc instanceof Function) {
						return this.$base.count(predicateFunc);
					} else {
						return this.$_.itemArray.length;
					}
				},

				itemAt: function(index) {
					return this.$_.itemArray[index];
				},

				indexOf: function(item) {
					var index = -1;
					var found = false;

					var enumerator = this.enumerator;

					do {
						index++;

						found = enumerator.moveNext() == item;
					}
					while(!found && enumerator.hasNext());

					if(found) {
						return index;
					} else {
						return -1;
					}
				},

				add: function(item) {
					this.$_.itemArray.push(item);
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this.$_.$derived.add(item);
					}).bind(this));
				},

				insertAt: function(index, item) {
					this.$_.itemArray.splice(index, 0, item);
				},

				replaceAt: function(index, item) {
					this.$_.itemArray[index] = item;
				},

				remove: function(item) {
					this.removeAt(this.indexOf(item));
				},

				removeAt: function(index) {
					this.$_.itemArray.splice(index, 1);
				},

				toString: function() {
					var textArray = [];

					for(var index in this.$_.itemArray) {
						if(this.$_.itemArray[index] !== undefined) {
							textArray.push(this.$_.itemArray[index].toString());
						}
					}

					return textArray.join(", ");
				}
			}
		});
	});
})();
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

	$namespace.register("joopl.collections", function() {
		this.TypedList = $def({
			$extends: this.List,
			$constructor: function (args) {
			    if (typeof args != "object" || typeof args.T != "function") {
			        debugger;
			        throw new $global.joopl.ArgumentException({
			            argName: "args",
                        reason: "TypedList has no parameterless constructor. Requires the 'T' argument - collection type -"
			        });
			    }

			    this.$base.$ctor();

				this.$_.T = args.T;
			},
			$members: {
				get T() {
					return this.$_.T;
				},

				indexOf: function(item) {
					if(typeof item != "Object") {
						item = $global.joopl.Convert.toObject(item);
					}

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot find the item index. Wrong item type"
						});
					}

					return this.$base.indexOf(item);
				},

				add: function(item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot add the item. Wrong item type"
						});
					}

					this.$base.add(item);
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this.add(item);
					}).bind(this));
				},

				insertAt: function(index, item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot insert the item at the given index. Wrong item type"
						});
					}

					this.$base.insertAt(index, item);
				},

				replaceAt: function(index, item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot replace the item at the given index. Wrong item type"
						});
					}

					this.$base.replaceAt(index, item);
				},

				remove: function(item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot remove the item. Wrong item type"
						});
					}

					this.removeAt(this.indexOf(item));
				}
			}
		});
	});
})();
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

	$namespace.register("joopl.collections", function() {
		this.ObservableChange = new ($def({
			$members: {
			    get added() { return 0; },
			    get replaced() { return 1; },
			    get removed() { return 2; }
			}
		}));
	});
})();
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

		this.ObservableList = $def({
			$extends: this.List,
			$constructor: function (args) {
			    this.$base.$ctor(args);
			},
			$members: {
			    $events: ["changed"],

			    add: function (item) {
			        this.$base.add(item);
			        this.changed({ source: this, changeKind: collections.ObservableChange.added, item: item });
				},

				insertAt: function (index, item) {
				    this.$base.insertAt(index, item);
				    this.changed({ source: this, changeKind: collections.ObservableChange.added, item: item });
				},

				replaceAt: function (index, item) {
				    this.$base.replaceAt(index, item);
				    this.changed({ source: this, changeKind: collections.ObservableChange.replaced, oldItem: this.getItemAt(index), item: item });
				},

				remove: function (item) {
				    this.$base.remove(item);
				    this.changed({ source: this, changeKind: collections.ObservableChange.removed, item: item });
				},

				removeAt: function (index) {
				    this.$base.removeAt(index);
				    this.changed({ source: this, changeKind: collections.ObservableChange.removed, item: this.getItemAt(index) });
				}
			}
		});
	});
})();
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

		this.Index = $def({
			$extends: collections.Enumerable,
			$constructor: function (args) {
				if(typeof args != "object") {
					if(typeof args != "object") {
						throw new $global.joopl.ArgumentException({
							argName: "args",
							reason: "The constructor requires parameters"
						});
					}
				}

				if(typeof args.source != "object") {
					throw new $global.joopl.ArgumentException({
						argName: "property",
						reason: "Indexes must be associated to a source"
					});
				}

				if(typeof args.property != "string") {
					throw new $global.joopl.ArgumentException({
						argName: "property",
						reason: "Indexes require which property must be indexed"
					});
				}

				this.$_.source = args.source;
				this.$_.property = args.property;
				this.$_.unique = typeof args.unique == "boolean" ? args.unique : false;
			},
			$members: {
				get source() {
					return this.$_.source;
				},
				get unique() {
					return this.$_.unique;
				},

				get property() {
					return this.$_.property;
				},

				onDataChange: function(args) {
				}
			}
		});
	});
})();
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

	$namespace.register("joopl.collections", function() {
		var collections = this;

		this.OrderedStringIndex = $def({
			$extends: collections.Index,
			$constructor: function(args) {
				this.$base.$ctor(args);

				this.$_.partitions = new collections.List();
				this.$_.vocalPartitionRegEx = new RegExp("^(a|e|i|o|u|aa|ae|ai|ao|au|ea|ee|ei|eo|eu|ia|ie|io|iu|oa|oe|oi|oo|ou|ua|ue|ui|uo|uu)", "gi");
				this.$_.consonantPartitionRegEx = new RegExp("^(b|c|Ã§|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)", "gi");
				this.$_.numericAndSymbol = new RegExp("^[A-Za-z]", "gi")

				this.initialize();
			},

			$members: {
				get enumerator() {
					return this.source.enumerator;
				},
				get vocalPartitionRegEx() { 
					return this.$_.vocalPartitionRegEx;
				},

				get consonantPartitionRegEx() {
					return this.$_.consonantPartitionRegEx;
				},

				initialize: function() {
					var partitions = this.$_.partitions;

					var abc = "abcdefghijklmnopqrstuvwxyz";
					var vocals = "aeiou";
					var letter = null;
					var vocal = null;

					partitions.add({ id: "other", store: new collections.List() });

					for(var letterIndex in abc) {
						letter = abc[letterIndex];

						if(vocals.indexOf(letter) == 0) {
							partitions.add({ id: letter, store: new collections.List() });
							
							for(var vocalIndex in vocals) {
								vocal = vocals[vocalIndex];

								partitions.add({ id: letter + vocal, store: new collections.List() });
							}
						} else {
							partitions.add({ id: letter, store: new collections.List() });
						}
					}
				},

				findPartition: function(item) {
					var partitionId = null;

					var isVocal = this.vocalPartitionRegEx.test(item);

					if(isVocal) {
						if(this.vocalPartitionRegEx.test(item.substring(0, 2).toLowerCase())) {
							partitionId = item.substring(0, 2);
						} else {
							partitionId = item[0];
						}
					} else if(this.consonantPartitionRegEx.test(item[0].toLowerCase())) {
						partitionId = item[0];
					} else {
						partitionId = "other";
					}

					partitionId = partitionId.toLowerCase();

					return this.$_.partitions.singleOrNull(function(item) { return item.id == partitionId });
				},

				onDataChange: function(args) {
					switch(args.changeKind) {
						case collections.ObservableChange.added:
							this.onAdded({ item: args.item });
							break;

						case collections.ObservableChange.replaced:
							this.onReplaced({ item: args.item });
							break;

						case collections.ObservableChange.removed:
							this.onRemoved({ item: args.item });
							break;
					}
				},

				onAdded: function(args) {
					var propertyName = this.property;
					var searchValue = args.item[propertyName];
					var propertySelectorFunc = this.propertySelectorFunc;
					var partition = this.findPartition(searchValue);

					if(this.unique) {
						if(partition.store.count(function(storeItem) { return storeItem[propertyName] === searchValue; }) == 0) {
							partition.store.add(args.item);
						} else {
							throw new $global.joopl.ArgumentException({
								argName: "item",
								reason: "Unique index violation"
							});
						}
					} else {
						partition.store.add(args.item);
					}
				},

				onReplaced: function(args) {
					var partition = this.findPartition(args.item);

					if(this.unique) {
						if(partition.store.count(function(item) { return item.value == args.item }) > 0) {
							throw new $global.joopl.ArgumentException({
								argName: "item",
								reason: "Unique index violation"
							});
						}
					}

					var replacedItemIndex = partition.store.indexOf(args.oldItem);
					partition.store.replaceAt(replacedItemIndex, args.item);
				},

				onRemoved: function(args) {
					var partition = this.findPartition(args.item);

					var removedItemIndex = partition.store.indexOf(args.item);
					partition.store.removeAt(replacedItemIndex);
				},

				forEach: function(predicateFunc) {
					throw new $global.joopl.NotImplementedException();
				},

				reverse: function() {
					throw new $global.joopl.NotImplementedException();
				},

				single: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.single(predicateFunc.bind(propertySelector[this.property]));
				},

				singleOrNull: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.singleOrNull(predicateFunc.bind(propertySelector[this.property]));
				},

				first: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.first(predicateFunc.bind(propertySelector[this.property]));
				},

				firstOrNull: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.firstOrNull(predicateFunc.bind(propertySelector[this.property]));
				},

				last: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.last(predicateFunc.bind(propertySelector[this.property]));
				},

				lastOrNull: function (propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.lastOrNull(predicateFunc.bind(propertySelector[this.property]));
				},

				count: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.count(predicateFunc.bind(propertySelector[this.property]));
				},

				where: function(propertySelector, predicateFunc) {		
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.where(predicateFunc.bind(propertySelector[this.property]));
				}
			}
		});
	});
})();
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
