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
            # User interface data-binding

            @module User interface data-binding
        */

    /**
        @namespace joopl.ui
        */
    $namespace.register("joopl.ui", function () {
        var ui = this;

        /**
                Represents a collection binder. That is, this binder binds a ObservableList to the bound list-style HTML element.
    
                @class CollectionBinder
                @constructor
                @param binder {Binder} The binder.
            */
        this.CollectionBinder = $def({
            $constructor: function (args) {
                this.$_.boundObject = args.binder.boundObject;
                this.$_.element = args.binder.element;
            },

            $members: {
                /**
                                Gets the bound joopl.collections.ObservableList.
    
                                @property observable 
                                @type joopl.collections.ObservableList
                                **/
                get observable() {
                    return this.$_.boundObject;
                },

                /**
                                Gets the bound HTML element
    
                                @property element 
                                @type jQuery object
                                **/
                get element() {
                    return this.$_.element;
                },

                /**
                                Sets the collection item rendering template. The item template must build a jQuery object.
    
                                For example:
    
                                        function(item, index) {
                                                var div = $("<div />");
                                                div.text(item.text);
                                                
                                                return div;
                                        }
    
                                @method itemTemplate 
                                @param templateFunc {Function} The predicate function defining the item template.
                                @return {CollectionBinder} The same joopl.ui.CollectionBinder binder is returned;
                                **/
                itemTemplate: function (templateFunc) {
                    // First of all, this render the data items in the observable list.
                    if (this.observable.items.length > 0) {
                        for (var index in this.observable.items) {
                            this.element.append(templateFunc(this.observable.items[index]));
                        }
                    }

                    // Adds a change event listener on the observable list in order to react to changes and 
                    // render some data item HTML (or remove it).
                    this.observable.addChangedListener((function (reason, args) {
                        var itemTemplate = templateFunc(args.item, args.index);

                        switch (reason) {
                            case $global.joopl.collections.ObservableListReason.itemAdded:
                                this.element.append(itemTemplate);
                                break;

                            case $global.joopl.collections.ObservableListReason.itemRemoved:
                                $(this.element.children()[args.index]).remove();
                                break;
                        }
                    }).bind(this));

                    return this;
                },
            }
        });
    });
})();