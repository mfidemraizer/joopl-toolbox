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