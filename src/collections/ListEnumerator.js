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