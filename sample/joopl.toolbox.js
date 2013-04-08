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

        /**
            Represents an enumeration of possible reasons of a change in an observable list.
    
                @class ObservableListReason
                @static
            */
        var clazz = $def({
            $members: {
                /**
                                An item has been added to the observable list.
    
                                @property itemAdded 
                                @type Number
                                **/
                get_ItemAdded: function () {
                    return 0;
                },

                /**
                                An item has been removed in the observable list.
    
                                @property itemRemoved 
                                @type Number
                                **/
                get_ItemRemoved: function () {
                    return 1;
                }
            }
        });

        this.ObservableListReason = new clazz();
    });
})();
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

var $binder = null;

(function (undefined) {
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

        var binderClazz = $def({
            $members: {

                /**
                                Creates a binder based on a given HTML CSS selector.
    
                                @method for 
                                @param cssSelector {String} A valid CSS selector to the whole HTML element(s) to bind on.
                                @return {Binder} The binder.
                                **/
                for: function (cssSelector) {
                    return new ui.Binder({ cssSelector: cssSelector });
                }
            }
        });

        $binder = new binderClazz();

        /**
                Represents the default, entry point data binder.
    
                @class Binder
                @constructor
                @param cssSelector {String} A CSS selector pointing to the element(s) handled by the binder..
            */
        this.Binder = $def({
            $constructor: function (args) {
                this.$_.boundObject = null;
                this.$_.element = $(args.cssSelector);

                if (this.$_.element.length == 0) {
                    throw Error("Given CSS selector matched no element");
                }
            },
            $members: {
                /**
                                Gets or sets the bound object
    
                                @property boundObject 
                                @type Object
                                **/
                get_BoundObject: function () {
                    return this.$_.boundObject;
                },

                set_BoundObject: function (value) {
                    this.$_.boundObject = value;
                },

                /**
                                Gets the bound HTML element
    
                                @property element 
                                @type jQuery object
                                **/
                get_Element: function () {
                    return this.$_.element;
                },

                /**
                                Binds a given object to the binder and returns a property binder to define which property or properties of the bound object will be synchronized with the bound HTML element.
    
                                @method object 
                                @param boundObject {Object} The object to be bound.
                                @return {PropertyBinder} A joopl.ui.PropertyBinder binder to configure the bound object property/properties.
                                **/
                object: function (boundObject) {
                    this.boundObject = boundObject;

                    return new ui.PropertyBinder({ binder: this });
                },

                /**
                                Binds a given array of objects (either primitive or custom ones) and returns a collection binder.
    
                                @method collection 
                                @param collection {Array} An array of objects to be bound.
                                @return {CollectionBinder} A joopl.ui.CollectionBinder binder to configure the bound collection.
                                **/
                collection: function (collection) {
                    if (typeof collection != "object" || !(collection instanceof Array || collection instanceof $global.joopl.collections.List)) {
                        throw Error("The given argument is not an array!");
                    }

                    this.$_.boundObject = new $global.joopl.collections.ObservableList({ array: collection });

                    return new ui.CollectionBinder({ binder: this });
                }
            }
        });
    });
})(undefined);
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
                Represents a property binder. That is, this binder binds a property of the bound object..
    
                @class PropertyBinder
                @constructor
                @param binder {Binder} The binder.
            */
        this.PropertyBinder = $def({
            $constructor: function (args) {
                this.$_.valueFunc = null;
                this.$_.boundObject = args.binder.boundObject;
                this.$_.element = args.binder.element;
                this.$_.propertyPredicate = null;
            },
            $members: {
                /**
                                Gets the bound object
    
                                @property boundObject 
                                @type Object
                                **/
                get_BoundObject: function () {
                    return this.$_.boundObject;
                },

                /**
                                Gets the bound HTML element
    
                                @property element 
                                @type jQuery object
                                **/
                get_Element: function () {
                    return this.$_.element;
                },

                /**
                                Gets or sets the HTML element value function predicate
    
                                @property valueFunc 
                                @type Function
                                **/
                get_ValueFunc: function () {
                    return this.$_.valueFunc;
                },

                set_ValueFunc: function (value) {
                    this.$_.valueFunc = value;
                },

                /**
                                Gets or sets the property function predicate.
    
                                @property propertyPredicate 
                                @type Function
                                **/
                get_PropertyPredicate: function () {
                    return this.$_.propertyPredicate;
                },

                set_PropertyPredicate: function (value) {
                    this.$_.propertyPredicate = value;
                },

                /**
                                Binds the given object property specified by the predicate. The whole predicate receives the bound object and ta value as input parameters.
                                For example:
    
                                        function(boundObject, value) {
                                                boundObject.text = value;
                                        }
                                @method property 
                                @param predicate {Function} The property predicate function.
                                @return {EventBinder} a joopl.ui.EventBinder binder to configure the event that trigger changes in the bindings.
                                **/
                property: function (predicate) {
                    this.propertyPredicate = predicate;

                    // If the value predicate is not set yet...
                    if (!this.valueFunc) {
                        var nodeName = this.element.prop("nodeName");

                        // Depending on the HTML element, the value of the whole element
                        // should be retrieved in many ways...
                        switch (nodeName.toLowerCase()) {
                            case "input":
                            case "textarea":
                            case "select":
                            case "button":
                                this.valueFunc = (function (value) {
                                    if (!value)
                                        return this.element.val();
                                    else
                                        this.element.val(value);
                                }).bind(this);
                                break;

                            default:
                                this.valueFunc = (function (value) {
                                    if (!value)
                                        return this.element.text();
                                    else
                                        this.element.text(value);
                                }).bind(this);
                        }
                    }

                    return new ui.EventBinder({ binder: this });
                }
            }
        });
    });
})();
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
    $namespace.register("joopl.ui", function() {
        var ui = this;
        /**
                Represents an event binder. That is, this binder adds an event handler to the HTML element in order to sinchronize with the bound object property value.
    
                @class EventBinder
                @constructor
                @param binder {PropertyBinder} The property binder.
            */
        this.EventBinder = $def({
            $constructor: function (args) {
                this.$_.element = args.binder.element;
                this.$_.boundObject = args.binder.boundObject;
                this.$_.valueFunc = args.binder.valueFunc;
                this.$_.propertyPredicate = args.binder.propertyPredicate;
            },
            $members: {
                /**
                                Gets the bound object
    
                                @property boundObject 
                                @type Object
                                **/
                get_BoundObject: function () {
                    return this.$_.boundObject;
                },

                /**
                                Gets the HTML element value function predicate
    
                                @property valueFunc 
                                @type Function
                                **/
                get_ValueFunc: function () {
                    return this.$_.valueFunc;
                },

                /**
                                Gets the bound HTML element
    
                                @property element 
                                @type jQuery object
                                **/
                get_Element: function () {
                    return this.$_.element;
                },


                /**
                                Gets the bound object property function predicate
    
                                @property propertyPredicate 
                                @type Function
                                **/
                get_PropertyPredicate: function () {
                    return this.$_.propertyPredicate;
                },

                /**
                                Binds the HTML element to the configured object property to be synchronized it on the specified event.
    
                                @method event 
                                @param eventName {String} The compatible jQuery event name.
                                @return {TwoWayBinder} a joopl.ui.TwoWayBinder binder to configure two-way binding if needed.
                                **/
                event: function (eventName) {
                    this.element.on(eventName, (function () {
                        this.propertyPredicate(this.boundObject, this.valueFunc());
                    }).bind(this));

                    return new ui.TwoWayBinder({ binder: this });
                }
            }
        });
    });
})();
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
                get_Observable: function () {
                    return this.$_.boundObject;
                },

                /**
                                Gets the bound HTML element
    
                                @property element 
                                @type jQuery object
                                **/
                get_Element: function () {
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
                Represents a two-way binder. It adds the required handlers to reflect changes in the HTML bound element when
                the bound object property changes.
    
                @class TwoWayBinder
                @constructor
                @param binder {EventBinder} The event binder.
            */
        this.TwoWayBinder = $def({
            $constructor: function (args) {
                this.$_.boundObject = args.binder.boundObject;
                this.$_.valueFunc = args.binder.valueFunc;
            },
            $members: {
                /**
                                Gets the bound object
    
                                @property boundObject 
                                @type Object
                                **/
                get_BoundObject: function () {
                    return this.$_.boundObject;
                },

                /**
                                Gets the HTML element value function predicate
    
                                @property valueFunc 
                                @type Function
                                **/
                get_ValueFunc: function () {
                    return this.$_.valueFunc;
                },

                /**
                                Builds binder to support two-way binding.
    
                                @method twoWay 
                                @return {Object} A proxy of the bound object that is able of raise events when a property changes. **This is the object that must be used in order to change object property values**. The proxy both changes the bound HTML element and the proxied bound object properties.
                                **/
                twoWay: function () {
                    if (!this.boundObject) {
                        throw Error("No object has been bound to the binder");
                    }

                    var proxy = {};
                    var that = this;

                    var definePropertyFunc = function (propertyName) {
                        Object.defineProperty(
                            proxy,
                            propertyName,
                            {
                                get: function () {
                                    return that.boundObject[propertyName];
                                },
                                set: function (value) {
                                    that.boundObject[propertyName] = value;

                                    // If the proxied property is set, the HTML element value is modified too
                                    that.valueFunc(value);
                                },
                                configurable: false,
                                enumerable: true
                            }
                        );
                    }

                    // Iterates all own boundObject properties in order to create the whole proxy property on the proxy object
                    for (var propertyName in this.boundObject) {
                        if (this.boundObject.hasOwnProperty(propertyName)) {
                            // This is a fix because otherwise the defined getter and/or setter will have the later
                            // propertyName reference rather than the one of the iteration (no iteration capture...)
                            definePropertyFunc(propertyName);
                        }
                    }

                    Object.preventExtensions(proxy);

                    return proxy;
                }
            }
        });
    });
})();
