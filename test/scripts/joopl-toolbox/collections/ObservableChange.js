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
        Represents an enumeration of available observable changes produced by a collection of objects

        @class ObservableChange
        @final
      */
	    this.declareEnum("ObservableChange", {
          /**
            Defines that some item has been added to the collection

            @property added
            @readOnly
            @type number
          */
	        added: 1,

          /**
            Defines that some item has been replaced in the collection

            @property replaced
            @readOnly
            @type number
          */
	        replaced: 2,

          /**
            Defines that some item has been removed from the collection

            @property removed
            @readOnly
            @type number
          */
	        removed: 3
	    });
	});
})();