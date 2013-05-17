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