(function() {
	"use strict";

	$namespace.register("joopl.collections", function() {
		this.TypedList = $def({
			$extends: this.List,
			$constructor: function (args) {
			    if (typeof args != "object" || typeof args.T != "function") {
			        debugger;
			        throw new $global.joopl.ArgumentException({
			            argName: "args",
                        reason: "TypedList has no parameterless constructor. Requires the 'T' argument - collection type -"
			        });
			    }

			    this.$base.$ctor();

				this.$_.T = args.T;
			},
			$members: {
				get T() {
					return this.$_.T;
				},

				indexOf: function(item) {
					if(typeof item != "Object") {
						item = $global.joopl.Convert.toObject(item);
					}

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot find the item index. Wrong item type"
						});
					}

					return this.$base.indexOf(item);
				},

				add: function(item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot add the item. Wrong item type"
						});
					}

					this.$base.add(item);
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this.add(item);
					}).bind(this));
				},

				insertAt: function(index, item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot insert the item at the given index. Wrong item type"
						});
					}

					this.$base.insertAt(index, item);
				},

				replaceAt: function(index, item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot replace the item at the given index. Wrong item type"
						});
					}

					this.$base.replaceAt(index, item);
				},

				remove: function(item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						debugger;
						throw new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot remove the item. Wrong item type"
						});
					}

					this.removeAt(this.indexOf(item));
				}
			}
		});
	});
})();