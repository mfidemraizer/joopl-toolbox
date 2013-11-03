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
(function(undefined) {
    "use strict";

	$namespace.register("joopl.collections", function() {
		var collections = this;

		this.declareClass("List", {
			inherits: this.Enumerable,
			ctor: function(args) {
				this._.capacity = args ? (typeof args.capacity == "number" ? args.capacity : 0) : 0;
				this._.itemArray = args ? (args.itemArray instanceof Array ? args.itemArray : []) : [];
				this._.capacityCursor = 0;

				if(this.capacity) {
					this.itemArray[this.capacity - 1] = undefined;
				}
			},
			members: {
				get enumerator() {
					return new collections.ListEnumerator({ itemArray: this._.itemArray });
				},

				get capacity() {
					return this._.capacity;
				},

				get itemArray() {
					return this._.itemArray;
				},

				get capacityCursor() {
					return this._.capacityCursor;
				},

				increaseCapacityCursor: function() {
					this._.capacityCursor++;
				},

				avoidOverCapacityFunc: function(item) {
					return item !== undefined;
				},

				reverse: function(predicateFunc) {
					var reversed = this._.itemArray.slice().reverse();

					var reversedList = new collections.List();

					for(var index = 0; index < reversed.length; index++) {
						reversedList.add(reversed[index]);
					}

					return reversedList;
				},

				count: function(predicateFunc) {
					var that = this;

					if(predicateFunc instanceof Function) {
						return this.base.count(function(item) {
							return that.avoidOverCapacityFunc(item) && predicateFunc(item);
						});
					} else {
						if(this.capacity == 0) {
							return this.itemArray.length;
						} else {
							return this.base.count(that.avoidOverCapacityFunc);
						}
					}
				},

				itemAt: function(index) {
					return this._.itemArray[index];
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
					if(item === undefined) {
						throw new Error(new $global.joopl.ArgumentException({ memberName: "item", reason: "Undefined values are not supported" }));
					}

					if(this.capacity == 0) {
						this.itemArray.push(item);
					} else if(this.capacity <= this.itemArray.length) {
						this.itemArray[this.capacityCursor] = item;
						this.increaseCapacityCursor();
					} else {
						throw new Error(new $global.joopl.ArgumentException({
							argName: "item",
							reason: "List capacity exceeded"
						}));
					}
				},

				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this._.derived.add(item);
					}).bind(this));
				},

				insertAt: function(index, item) {
					if(index >= this.count()) {
						throw new Error(new $global.joopl.ArgumentException({ memberName: "index", reason: "Index out of range" }));
					}

					if(item === undefined) {
						throw new Error(new $global.joopl.ArgumentException({ memberName: "item", reason: "Undefined values are not supported" }));
					}

					this.itemArray.splice(index, 0, item);
				},

				replaceAt: function(index, item) {
					if(index >= this.count()) {
						throw new Error(new $global.joopl.ArgumentException({ memberName: "index", reason: "Index out of range" }));
					}

					if(item === undefined) {
						throw new Error(new $global.joopl.ArgumentException({ memberName: "item", reason: "Undefined values are not supported" }));
					}

					this.itemArray[index] = item;
				},

				remove: function(item) {
					this.removeAt(this.indexOf(item));
				},

				removeAt: function(index) {
					if(index >= this.count()) {
						throw new Error(new $global.joopl.ArgumentException({ memberName: "index", reason: "Index out of range" }));
					}

					this.itemArray.splice(index, 1);
				},

				skip: function(numberOfItems) {
					if(numberOfItems > this.count()) {
						throw new Error(new $global.joopl.ArgumentException({ memberName: "numberOfItems", reason: "Out of range" }));
					}

					return new collections.List({ itemArray: this.itemArray.splice(0, numberOfItems) });
				}, 

				toArray: function() {
					var result = this.where(function(item) {
						return item !== undefined;
					});

					var arr = [];

					result.forEach(function(item) {
						arr.push(item);
					});

					return arr;
				},

				toString: function() {
					var textArray = [];

					for(var index in this.itemArray) {
						if(this.itemArray[index] !== undefined) {
							textArray.push(this.itemArray[index].toString());
						}
					}

					return textArray.join(", ");
				}
			}
		});
	});
})(undefined);
