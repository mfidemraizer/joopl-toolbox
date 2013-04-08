/*
Copyright Matias Fidemraizer
JOOPL TOOLBOX
http://joopl.codeplex.com
http://www.matiasfidemraizer.com

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
            @module Collections
        */

    /**
        @namespace joopl.collections
        */
    $namespace.register("joopl.collections", function () {

        /**
            Represents a list of objects.
                @class List
                @constructor
                @param array {Array} An abitrary array of objects that will be used to initialize the list
                @optional
            */
        this.List = $def({
            $constructor: function (args) {
                this.$_.array = args && args.array ? args.array : [];
            },
            $members: {
                /**
                                Gets the underlying list items as an array of objects.
    
                                @property items 
                                @type Array
                                **/
                get_Items: function () {
                    return this.$_.array;
                },

                /**
                                Gets the current item count
    
                                @method count 
                                @return {Number} The item count
                                **/
                count: function () {
                    return this.$_.array.length;
                },

                /**
                                Adds an object item to the list
    
                                @method add 
                                @param item {Object} The object to add as a new item to the list
                                **/
                add: function (item) {
                    this.$_.array.push(item);
                },

                /**
                                Removes an item in the given index position.
    
                                @method removeAt 
                                @param index {Number} The item index
                                @return {Object} The removed object item
                                **/
                removeAt: function (index) {
                    var item = this.items[index];
                    this.items.splice(index, 1);

                    return item;
                },
            }
        });
    });
})();