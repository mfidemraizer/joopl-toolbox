/*
Copyright Matias Fidemraizer
JOOPL FRAMEWORK
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
        var collections = this;

        /**
            Represents an observable list of objects. Raises events once an item is added, removed or changed.
    
                @class ObservableList
                @extends joopl.collections.List
                @constructor
                @param array {Array} An abitrary array of objects that will be used to initialize the list
                @optional
            */
        this.ObservableList = $def({
            $constructor: function (args) {
                this.$base.$ctor(args);

                this.$_.changedHandlers = [];
            },
            $members: {
                /**
                                Raises all change handlers. It is intended for the framework nor direct usage by developers.
    
                                @method raiseHandlers 
                                @param reason {Number} A ObservableListReasons enumeration value giving the reason of the change.
                                @param args {Object} An object containing arguments for the handler. The content may vary depending on the reason.
                                **/
                raiseHandlers: function (reason, args) {
                    for (var index in this.$_.changedHandlers) {
                        this.$_.changedHandlers[index](reason, args);
                    }
                },

                /**
                                Adds a change event listener.
    
                                @method addChangedListener 
                                @param handler {Function} An event handler function having two input parameters: @reason and @args.
                                **/
                addChangedListener: function (handler) {
                    this.$_.changedHandlers.push(handler);
                },

                /**
                                Adds an object item to the list
    
                                @method add 
                                @param item {Object} The object to add as a new item to the list
                                **/
                add: function (item) {
                    this.$base.add(item);
                    this.raiseHandlers(collections.ObservableListReason.itemAdded, { item: item, index: this.count() - 1 });
                },


                /**
                                Removes an item in the given index position.
    
                                @method removeAt 
                                @param index {Number} The item index
                                @return {Object} The removed object item
                                **/
                removeAt: function (index) {
                    var item = this.$base.removeAt(index);
                    this.raiseHandlers(collections.ObservableListReason.itemRemoved, { item: item, index: index });

                    return item;
                }
            },
            $extends: this.List
        });
    });
})();