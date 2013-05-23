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