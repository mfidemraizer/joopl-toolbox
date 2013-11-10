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

    /**
		@namespace joopl.collections
    */

	$namespace.register("joopl.collections", function() {
		var collections = this;

		/**
			Represents an ordered collection of objects

			@class List
			@extends joopl.collections.Enumerable
			@param {number} capacity (optional) Initializes the list with a predefined maximum capacity and allocates memory to enforce read and write operations
			@param {Array} itemArray (optional) Initializes the list with items from an existing array.
			@constructor
			@example
				new this.List(); // Default constructor
				new this.List({ capacity: 5 }); // Specifies list's capacity
				new this.List({ itemArray: ["hello", "world"]}); // Gives default items to the list
				new this.List({ capacity: 5, itemArray: ["hello", "world"] }); // Both gives default items and list's capacity
		*/
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

				/**
					Gets list's capacity 
					
					@property capacity
					@type number
					@readOnly
				*/
				get capacity() {
					return this._.capacity;
				},

				/**
					Gets underlying item array which represents in-memory list's storage

					@property itemArray
					@private
					@type Array
					@readOnly
				*/
				get itemArray() {
					return this._.itemArray;
				},


				/**
					Gets underlying item array cursor (SYSTEM USE ONLY)

					@property capacityCursor
					@private
					@type number
					@readOnly
				*/
				get capacityCursor() {
					return this._.capacityCursor;
				},

				/**
					Increases capacity cursor (SYSTEM USE ONLY)

					@method increaseCapacityCursor
					@private
				*/
				increaseCapacityCursor: function() {
					this._.capacityCursor++;
				},

				/**
					Increases capacity cursor (SYSTEM USE ONLY)

					@method avoidOverCapacityFunc
					@private
				*/
				avoidOverCapacityFunc: function(item) {
					return item !== undefined;
				},

				reverse: function(predicateFunc) {
					var reversed = this._.itemArray.slice().reverse();

					var reversedList = new collections.List();

					for(var index = 0; index < reversed.length; index++) {
						if(reversed[index] !== undefined) {
							reversedList.add(reversed[index]);
						}
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

				/**
					Gets an item at the given index in the list

					@method itemAt
					@param {number} index An index in the list
					@return {object} The obtained item in the given index
				*/
				itemAt: function(index) {
					return this._.itemArray[index];
				},

				/**
					Finds the numeric index of a given item in the list.

					@method indexOf
					@param {object} item The whole item to search for its index
					@return {number} Returns the found index for the given item. If it is not found, returns -1
				*/
				indexOf: function(item) {
					var index = -1;
					var found = false;

					var enumerator = this.enumerator;

					do {
						index++;

						found = enumerator.moveNext() == item;
					}
					while(!found && enumerator.hasNext);

					if(found) {
						return index;
					} else {
						return -1;
					}
				},

				/**
					Adds an item to the list

					@method add
					@param {object} item The whole item to add
				*/
				add: function(item) {
					if(item === undefined) {
						throw new $global.joopl.ArgumentException({ memberName: "item", reason: "Undefined values are not supported" });
					}

					if(this.capacity == 0) {
						this.itemArray.push(item);
					} else if(this.capacity <= this.itemArray.length) {
						this.itemArray[this.capacityCursor] = item;
						this.increaseCapacityCursor();
					} else {
						throw new $global.joopl.ArgumentException({
							argName: "item",
							reason: "List capacity exceeded"
						});
					}
				},

				/**
					Adds items in an Enumerable to current list

					@method addRange
					@param {Enumerable} enumerable The Enumerable to copy items from
				*/
				addRange: function(enumerable) {
					enumerable.forEach((function(item) {
						this._.derived.add(item);
					}).bind(this));
				},

				/**
					Inserts an item at the specified index

					@method insertAt
					@param {number} index The index in the list where the item will be inserted
					@param {object} item The item to insert
				*/
				insertAt: function(index, item) {
					if(index >= this.count()) {
						throw new $global.joopl.ArgumentException({ memberName: "index", reason: "Index out of range" });
					}

					if(item === undefined) {
						throw new $global.joopl.ArgumentException({ memberName: "item", reason: "Undefined values are not supported" });
					}

					this.itemArray.splice(index, 0, item);
				},

				/**
					Replaces an item at the specified index

					@method replaceAt
					@param {number} index The index in the list where the item will be replaced
					@param {object} item The item to use as replacement to the existing one at the specified index
				*/
				replaceAt: function(index, item) {
					if(index >= this.count()) {
						throw new $global.joopl.ArgumentException({ memberName: "index", reason: "Index out of range" });
					}

					if(item === undefined) {
						throw new $global.joopl.ArgumentException({ memberName: "item", reason: "Undefined values are not supported" });
					}

					this.itemArray[index] = item;
				},

				/**
					Removes the specified item from the list

					@method remove
					@param {object} item The item to remove from the list
				*/
				remove: function(item) {
					this.removeAt(this.indexOf(item));
				},

				/**
					Removes an item in the specified index

					@method removeAt
					@param {number} index The index of the item to be removed
				*/
				removeAt: function(index) {
					if(index >= this.count()) {
						throw new $global.joopl.ArgumentException({ memberName: "index", reason: "Index out of range" });
					}

					this.itemArray.splice(index, 1);
				},

				skip: function(numberOfItems) {
					if(numberOfItems > this.count()) {
						throw new $global.joopl.ArgumentException({ memberName: "numberOfItems", reason: "Out of range" });
					}

					var itemArray = this.toArray();

					return new collections.List({ itemArray: itemArray.splice(numberOfItems) });
				}, 

				toArray: function() {
					var result = this.where(function(item) {
						return item !== undefined;
					});

					var arr = [];
					arr[result.itemArray.length - 1] = undefined;

					var index = -1;

					result.forEach(function(item) {
						arr[++index] = item;
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