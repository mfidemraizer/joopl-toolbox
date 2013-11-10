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
			Represents a list of objects that can be observed for its changes:

			- When an item is *added*
			- When an item is *replaced*
			- When an item is *removed*

			@class ObservableList
			@extends joopl.collections.List
			@final
	    */
		this.declareClass("ObservableList", {
			inherits: this.List,
			ctor: function (args) {
			    this.base.ctor(args);
			},
			members: {
				/**
					Occurs when some item changes

					@event changed 
					@param {object} source The `ObservableList` instance which fires the event
					@param {joopl.collections.ObservableChange} changeKind The observable change kind (added, replaced and removed `ObservableChange` enumeration values`
					@param {object} item The affected item by the whole change
				*/
			    events: ["changed"],

			    add: function (item) {
			        this.base.add(item);
			        this.changed.raise({ args: { source: this, changeKind: collections.ObservableChange.added, item: item } });
				},

				insertAt: function (index, item) {
				    this.base.insertAt(index, item);
				    this.changed.raise({ args: { source: this, changeKind: collections.ObservableChange.added, item: item } });
				},

				replaceAt: function (index, item) {
				    this.base.replaceAt(index, item);
				    this.changed.raise({ args: { source: this, changeKind: collections.ObservableChange.replaced, oldItem: this.getItemAt(index), item: item } });
				},

				remove: function (item) {
				    this.base.remove(item);
				    this.changed.raise({ args: { source: this, changeKind: collections.ObservableChange.removed, item: item } });
				},

				removeAt: function (index) {
				    this.base.removeAt(index);
				    this.changed.raise({ args: { source: this, changeKind: collections.ObservableChange.removed, item: this.getItemAt(index) } });
				}
			}
		});
	});
})();
