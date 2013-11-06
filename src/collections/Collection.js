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

    /**
    	@namespace joopl.collections
	*/

	$namespace.register("joopl.collections", function() {

		/**
			Represents the base class for any collection of objects

			@extends joopl.Enumerable
			@class Collection
		*/
		this.declareClass("Collection", {
			imports: this.Enumerable,
			members: {

				/**
					In derived classes, adds an item to the collection

					@method add
					@returns {void}
				*/
			    add: function (item) {
			        throw new $global.joopl.NotImplementedException({ memberName: "Collection.add" });
				},

				/**
					In derived classes, takes an implementation of `Enumerable` and adds its items to the collection

					@method addRange
					@returns {void}
				*/
			    addRange: function (enumerable) {
			        throw new $global.joopl.NotImplementedException({ memberName: "Collection.addRange" });
				},

				/**
					In derived classes, removes the given item from the collection

					@method remove
					@returns {void}
				*/
			    remove: function (item) {
			        throw new $global.joopl.NotImplementedException({ memberName: "Collection.remove" });
				}
			}
		});
	});
})();