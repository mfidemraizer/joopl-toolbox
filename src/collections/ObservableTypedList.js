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