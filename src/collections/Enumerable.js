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
                    // TODO
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