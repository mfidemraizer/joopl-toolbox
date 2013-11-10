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
			Represents a List-based enumerator implementation

			@class ListEnumerator
			@constructor
			@param {Array} itemArray The underlying List's array
			@extends Enumerator
		*/
		this.declareClass("ListEnumerator", {
			inherits: this.Enumerator,
			ctor: function(args) {
				this._.itemArray = args.itemArray;
				this._.index = -1;
			},
			members: {
				/**
					Gets the underlying List's item array

					@readOnly
					@private
					@property itemArray
					@type Array
				*/
				get itemArray() {
					return this._.itemArray;
				},

				moveNext: function() {
					return this.itemArray[++this._.index];
				},

				get hasNext() {
					return this._.index + 1 < this.itemArray.length;
				}
			}
		});
	});
})();