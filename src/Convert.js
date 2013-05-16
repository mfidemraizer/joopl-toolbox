(function() {
	"use strict";

	$namespace.register("joopl", function() {
		this.Convert = new ($def({
			$members: {
				toObject: function(value, throwOnNotSupported) {
					switch(typeof value) {
						case "number":
							return new Number(value);
						case "string":
							return new String(value);
						case "boolean":
							return new Boolean(value);
						default: 
							if(throwOnNotSupported) {
								throw new this.ArgumentException({
									argName: "value",
									reason: "Primitive type not supported"
								});
							} else {
								return value;
							}
					}
				} 
			}
		}));
	});
})();