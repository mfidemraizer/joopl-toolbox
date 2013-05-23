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

				    if (result.count() == 0) {
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
					return this.$_.itemArray.join();
				}
			}
		});
	});
})();
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
(function() {
	"use strict";

	$namespace.register("joopl.collections", function () {
	    var collections = this;

		this.Index = $def({
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

				if(typeof args.property != "function") {
					throw new $global.joopl.ArgumentException({
						argName: "property",
						reason: "Indexes require which property must be indexed"
					});
				}

				this.$_.source = args.source;
				this.$_.propertySelectorFunc = args.property;
				this.$_.unique = typeof args.unique == "boolean" ? args.unique : false;
			},
			$members: {
				get source() {
					return this.$_.source;
				},
				get unique() {
					return this.$_.unique;
				},

				get propertySelectorFunc() {
					return this.$_.propertySelectorFunc;
				},

				get propertyName() {
					var parsed = esprima.parse(new RegExp("return (.+);").exec(this.propertySelectorFunc.toString())[1]);

					return parsed.body[0].expression.property.name;
				},

				onDataChange: function(args) {
				},

				where: function(indexedSearch) {
					throw new $global.joopl.NotImplementedException();
				}
			}
		});
	});
})();
(function() {
	"use strict";

	$namespace.register("joopl.collections", function() {
		var collections = this;

		this.OrderedStringIndex = $def({
			$extends: collections.Index,
			$constructor: function(args) {
				this.$base.$ctor(args);

				this.$_.partitions = new collections.List();
				this.$_.vocals = "aeiou";
				this.$_.vocalPartitionRegEx = new RegExp("^(a|e|i|o|u|aa|ae|ai|ao|au|ea|ee|ei|eo|eu|ia|ie|io|iu|oa|oe|oi|oo|ou|ua|ue|ui|uo|uu)");
				this.$_.consonantPartitionRegEx = new RegExp("^(b|c|Ã§|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)");
				this.$_.numericAndSymbol = new RegExp("^[A-Za-z]")

				this.initialize();
			},

			$members: {
				get vocalPartitionRegEx() { 
					return this.$_.vocalPartitionRegEx;
				},

				get consonantPartitionRegEx() {
					return this.$_.consonantPartitionRegEx;
				},

				initialize: function() {
					var partitions = this.$_.partitions;

					var abc = "abcÃ§defghijklmnopqrstuvwxyz";
					var vocals = "aeiou";
					var letter = null;
					var vocal = null;

					partitions.add({ id: "other", store: new collections.List() });

					for(var letterIndex in abc) {
						letter = abc[letterIndex];

						if(vocals.indexOf(letter) == 0) {
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
						if(this.vocalPartitionRegEx.test(item.substring(0, 2))) {
							partitionId = item.substring(0, 2);
						} else {
							partitionId = item[0];
						}
					} else if(this.consonantPartitionRegEx.test(item[0])) {
						partitionId = item[0];
					} else {
						partitionId = "other";
					}

					return this.$_.partitions.singleOrNull(function(item) { return item.id == partitionId });
				},

				onDataChange: function(args) {
					var indexArgs = { item: this.propertySelectorFunc(args.item) };

					switch(args.changeKind) {
						case collections.ObservableChange.added:
							this.onAdded(indexArgs);
							break;

						case collections.ObservableChange.replaced:
							this.onReplaced(indexArgs);
							break;

						case collections.ObservableChange.removed:
							this.onRemoved(indexArgs);
							break;
					}
				},

				onAdded: function(args) {
					var partition = this.findPartition(args.item);

					if(this.unique) {
						if(partition.store.count(function(item) { return item.value === args.item; }) == 0) {
							partition.store.add(args.item);
						} else {
							throw new $global.joopl.ArgumentException({
								argName: "item",
								reason: "Unique index violation"
							});
						}
					}
				},

				onReplaced: function(args) {

				},

				onRemoved: function(args) {

				},

				where: function(indexedSearch) {		
					var partition = this.findPartition(indexedSearch[this.propertyName]);

					return partition.store.where(indexedSearch.predicate.bind(indexedSearch[this.propertyName]));
				}
			}
		});
	});
})();
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

				where: function(predicateFuncOrIndexedSearch) {
					if(predicateFuncOrIndexedSearch instanceof Function) {
						return this.$base.where(predicateFuncOrIndexedSearch);

					} else if (typeof predicateFuncOrIndexedSearch == "object") {
						var propertyName = Object.keys(predicateFuncOrIndexedSearch)[0];
						var index = this.$_.indexes.singleOrNull(function(index) { return index.propertyName == propertyName; });

						if(typeof index == "object") {
							return index.where(predicateFuncOrIndexedSearch);
						}
					}
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
