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

(function () {
    "use strict";

    /**
    	@namespace joopl.collections
	*/
	$namespace.register("joopl.collections", function() {

		/**
			Represents the base class for an iterator to enumerate some sequence.

			@class Enumerator
		*/
		this.declareClass("Enumerator", {
			members: {
				/**
					In derived classes, moves the sequence to the next element and returns it.

					@method moveNext
					@returns {object} The next item.
				*/
				moveNext: function() {
					throw new $global.joopl.NotImplementedException({ memberName: "Enumerator.moveNext" });
				},

				/**
					In derived classes, determines if the sequence has a next item.

					@property hasNext
					@type boolean
					@readonly
				*/
				get hasNext() {
					throw new $global.joopl.NotImplementedException({ memberName: "Enumerator.hasNext" });
				}
			}
		});
	});
})();
