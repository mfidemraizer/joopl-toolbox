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