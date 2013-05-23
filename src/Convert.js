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