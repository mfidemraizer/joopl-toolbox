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