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

	$namespace.register("joopl.collections", function () {
	    var collections = this;

	    /**
			Represents the base class to implement indexes for `IndexableList`.

			@class Index
			@abstract
			@constructor
			@param {IndexedList} source The source `IndexedList`
			@param {string} property The name of the property to be indexed
			@param {boolean} (optional) unique A boolean giving `true` if it is an unique index or not.
			@extends joopl.collections.Enumerable
	    */
		this.declareClass("Index", {
			inherits: collections.Enumerable,
			ctor: function (args) {
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
						argName: "source",
						reason: "Indexes must be associated to a source"
					});
				}

				if(typeof args.property != "string") {
					throw new $global.joopl.ArgumentException({
						argName: "property",
						reason: "Indexes require which property must be indexed"
					});
				}

				this._.source = args.source;
				this._.property = args.property;
				this._.unique = typeof args.unique == "boolean" ? args.unique : false;
			},
			members: {
				/**
					Gets a reference to the associated `IndexedList`

					@property source
					@type IndexedList
					@readOnly
				*/
				get source() {
					return this._.source;
				},

				/**
					Gets a boolean which determines if it is an unique index or not

					@property unique
					@type boolean
					@readOnly
				*/
				get unique() {
					return this._.unique;
				},

				/**
					Gets the name of indexed property

					@property property
					@type string
					@readOnly
				*/
				get property() {
					return this._.property;
				},

				/**
					In derived classes, this method is called when some data changes and index should be recalculated or, at least, processed.

					@method onDataChange
					@param {object} args Optional arguments for the data change handling
					@return {void}
					@protected
				*/
				onDataChange: function(args) {
				}
			}
		});
	});
})();
