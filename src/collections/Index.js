(function() {
	"use strict";

	$namespace.register("joopl.collections", function () {
	    var collections = this;

		this.Index = $def({
			$constructor: function (args) {
				if(typeof args != "object") {
					if(typeof args != "object") {
						throw new $global.joopl.ArgumentException({
							argName: "args",
							reason: "The constructor requires parameters"
						});
					}
				}

				if(typeof args.source != "object") {
					throw new $global.joopl.ArgumentException({
						argName: "property",
						reason: "Indexes must be associated to a source"
					});
				}

				if(typeof args.property != "function") {
					throw new $global.joopl.ArgumentException({
						argName: "property",
						reason: "Indexes require which property must be indexed"
					});
				}

				this.$_.source = args.source;
				this.$_.propertySelectorFunc = args.property;
				this.$_.unique = typeof args.unique == "boolean" ? args.unique : false;
			},
			$members: {
				get source() {
					return this.$_.source;
				},
				get unique() {
					return this.$_.unique;
				},

				get propertySelectorFunc() {
					return this.$_.propertySelectorFunc;
				},

				get propertyName() {
					var parsed = esprima.parse(new RegExp("return (.+);").exec(this.propertySelectorFunc.toString())[1]);

					return parsed.body[0].expression.property.name;
				},

				onDataChange: function(args) {
				},

				where: function(indexedSearch) {
					throw new $global.joopl.NotImplementedException();
				}
			}
		});
	});
})();