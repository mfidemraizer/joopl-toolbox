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
						this.add(item);
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

		this.ObservableTypedList = $def({
			$extends: this.TypedList,
			$constructor: function (args) {
			    this.$base.$ctor(args);
			},
			$members: {
			    $events: ["changed"],

			    add: function (item) {
			        this.$base.add(item);
			        this.changed({ source: this, changeKind: collections.ObservableChange.added, item: item });
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this.add(item);
					}).bind(this));
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
