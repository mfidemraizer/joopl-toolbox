/*
 Copyright Matias Fidemraizer
 http://matiasfidemraizer.com
 http://www.linkedin.com/in/mfidemraizer/en

 jOOPL Toolbox
 https://github.com/mfidemraizer/joopl-toolbox

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
(function() {
    "use strict";

	$namespace.register("joopl.collections", function() {
		this.declareClass("TypedList", {
			inherits: this.List,
			ctor: function (args) {
			    if (typeof args != "object" || typeof args.T != "function") {
			        throw new Error(new $global.joopl.ArgumentException({
			            argName: "args",
                        reason: "TypedList has no parameterless constructor. Requires the 'T' argument - collection type -"
			        }));
			    }

			    this.base.ctor();

				this._.T = args.T;
			},

			members: {
				get T() {
					return this._.T;
				},

				indexOf: function(item) {
					if(typeof item != "Object") {
						item = new $global.joopl.Convert().toObject(item);
					}

					if(!(item instanceof this.T)) {
						throw new Error($global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot find the item index. Wrong item type"
						}));
					}

					return this.base.indexOf(item);
				},

				add: function(item) {
					if(typeof item != "Object") 
						item = new $global.joopl.Convert().toObject(item);

					if(!(item instanceof this.T)) {
						throw new Error(new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot add the item. Wrong item type"
						}));
					}

					this.base.add(item);
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this.add(item);
					}).bind(this));
				},

				insertAt: function(index, item) {
					if(typeof item != "Object") 
						item = new $global.joopl.Convert().toObject(item);

					if(!(item instanceof this.T)) {
						throw new Error(new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot insert the item at the given index. Wrong item type"
						}));
					}

					this.$base.insertAt(index, item);
				},

				replaceAt: function(index, item) {
					if(typeof item != "Object") 
						item = $global.joopl.Convert.toObject(item);

					if(!(item instanceof this.T)) {
						throw new Error(new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot replace the item at the given index. Wrong item type"
						}));
					}

					this.base.replaceAt(index, item);
				},

				remove: function(item) {
					if(typeof item != "Object") 
						item = new $global.joopl.Convert().toObject(item);

					if(!(item instanceof this.T)) {
						throw new Error(new $global.joopl.ArgumentException({
						 argName: "item", 
						 reason: "Cannot remove the item. Wrong item type"
						}));
					}

					this.removeAt(this.indexOf(item));
				}
			}
		});
	});
})();
