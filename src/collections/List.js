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
		this.List = $def({
			$extends: this.Enumerable,
			$constructor: function(args) {
				this.$_.itemArray = [];
			},
			$members: {
				get enumerator() {
					return new $global.joopl.collections.ListEnumerator({ itemArray: this.$_.itemArray });
				},

				reverse: function(predicateFunc) {
					var reversed = this.$_.itemArray.slice().reverse();

					var reversedList = new $global.joopl.collections.List();

					for(var index = 0; index < reversed.length; index++) {
						reversedList.add(reversed[index]);
					}

					return reversedList;
				},

				count: function(predicateFunc) {
					if(predicateFunc instanceof Function) {
						return this.$base.count(predicateFunc);
					} else {
						return this.$_.itemArray.length;
					}
				},

				itemAt: function(index) {
					return this.$_.itemArray[index];
				},

				indexOf: function(item) {
					var index = -1;
					var found = false;

					var enumerator = this.enumerator;

					do {
						index++;

						found = enumerator.moveNext() == item;
					}
					while(!found && enumerator.hasNext());

					if(found) {
						return index;
					} else {
						return -1;
					}
				},

				add: function(item) {
					this.$_.itemArray.push(item);
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this.$_.$derived.add(item);
					}).bind(this));
				},

				insertAt: function(index, item) {
					this.$_.itemArray.splice(index, 0, item);
				},

				replaceAt: function(index, item) {
					this.$_.itemArray[index] = item;
				},

				remove: function(item) {
					this.removeAt(this.indexOf(item));
				},

				removeAt: function(index) {
					this.$_.itemArray.splice(index, 1);
				},

				toString: function() {
					var textArray = [];

					for(var index in this.$_.itemArray) {
						if(this.$_.itemArray[index] !== undefined) {
							textArray.push(this.$_.itemArray[index].toString());
						}
					}

					return textArray.join(", ");
				}
			}
		});
	});
})();