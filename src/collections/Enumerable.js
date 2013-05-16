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

				first: function(predicateFunc) {
					var enumerator = this.$_.$derived.enumerator;
					var found = false;

					if(predicateFunc) {
						while(!found && enumerator.hasNext()) {
							var item = enumerator.moveNext();

							found = predicateFunc(item);
						}

						if(found) {
							return item;
						} else {
							return null;
						}
					} else {
						return enumerator.moveNext();
					}
				},

				last: function(predicateFunc) {
					var reversed = this.$_.$derived.reverse();

					return reversed.first(predicateFunc);
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