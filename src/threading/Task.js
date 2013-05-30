(function(Worker) {
	"use strict";

	$namespace.register("joopl.threading", function() {
		this.Task = $def({
			$constructor: function(predicateFunc) {
				if(!(predicateFunc instanceof Function) {
					throw new $global.joopl.ArgumentException({
						argName: "predicateFunc",
						reason: "Unexpected argument: given parameter is not a function"
					});
				}

				this.$_.predicateFunc = predicateFunc;
			},
			{
				get predicateFunc() {
					return this.$_.predicateFunc;
				},

				run: function() {
					var blob = window.URL.createObjectURL(
                    	new Blob(
                    		this.predicateFunc.toString(), 
                    		{ type: "text/javascript" }
                    	)
                    );

                    return new Worker(blob);
				}
			}
		});
	});
})(window.Worker);