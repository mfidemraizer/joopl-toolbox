(function() {
	"use strict";

	$namespace.register("joopl.collections", function() {
		this.Collection = $def({
			$extends: this.Enumerable,
			$members: {
			    add: function (item) {
			        debugger;
			        throw new $global.joopl.NotImplementedException();
				},

			    addRange: function (enumerable) {
			        debugger;
			        throw new $global.joopl.NotImplementedException();
				},

			    remove: function (item) {
			        debugger;
			        throw new $global.joopl.NotImplementedException();
				}
			}
		});
	});
})();