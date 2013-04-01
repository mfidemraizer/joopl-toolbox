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
/** 
    @module User interface (UI)
    @submodule Data-binding
*/

var $binder = null;

(function () {
    "use strict";

    /**
        @namespace joopl.ui
        */
    $namespace.register("joopl.ui");

    /**
        Represents an HTML-to-objects/objects-to-HTML binder factory. Creates binders.
            @class $binder
            @static
        */
    $binder = $new($def({
        $constructor: function () { },
        $members: {
            /**
                            Creates a binder based on a given HTML CSS selector.

                            @method for 
                            @param cssSelector {String} A valid CSS selector to the whole HTML element(s) to bind on.
                            @return {joopl.ui.Binder} The binder.
                            **/
            for: function (cssSelector) {
                return $new($global.joopl.ui.Binder, { cssSelector: cssSelector });
            }
        }
    }));

    /**
            Represents a two-way binder. It adds the required handlers to reflect changes in the HTML bound element when
            the bound object property changes.

            @class TwoWayBinder
            @constructor
            @param binder {joopl.ui.EventBinder} The event binder.
        */
    $global.joopl.ui.TwoWayBinder = $def({
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

                // Iterates all own boundObject properties in order to create the whole proxy property on the proxy object
                for (var propertyName in this.boundObject) {
                    if (this.boundObject.hasOwnProperty(propertyName)) {
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
                                configurable: false
                            }
                        );
                    }
                }

                Object.preventExtensions(proxy);

                return proxy;
            }
        }
    });

    /**
            Represents an event binder. That is, this binder adds an event handler to the HTML element in order to sinchronize with the bound object property value.

            @class EventBinder
            @constructor
            @param binder {joopl.ui.PropertyBinder} The property binder.
        */
    $global.joopl.ui.EventBinder = $def({
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

                return $new($global.joopl.ui.TwoWayBinder, { binder: this });
            }
        }
    });

    /**
            Represents a property binder. That is, this binder binds a property of the bound object..

            @class PropertyBinder
            @constructor
            @param binder {joopl.ui.Binder} The binder.
        */
    $global.joopl.ui.PropertyBinder = $def({
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

                return $new($global.joopl.ui.EventBinder, { binder: this });
            }
        }
    });

    /**
            Represents a collection binder. That is, this binder binds a joopl.collections.ObservableList to the bound list-style HTML element.

            @class CollectionBinder
            @constructor
            @param binder {joopl.ui.Binder} The binder.
        */
    $global.joopl.ui.CollectionBinder = $def({
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

    /**
            Represents the default, entry point data binder.

            @class Binder
            @constructor
            @param cssSelector {String} A CSS selector pointing to the element(s) handled by the binder..
        */
    $global.joopl.ui.Binder = $def({
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
                this.boundObject = obj;

                return $new($global.joopl.ui.PropertyBinder, { binder: this });
            },

            /**
                            Binds a given array of objects (either primitive or custom ones) and returns a collection binder.

                            @method collection 
                            @param collection {Array} An array of objects to be bound.
                            @return {CollectionBinder} A joopl.ui.CollectionBinder binder to configure the bound collection.
                            **/
            collection: function (collection) {
                if (typeof collection != "object" || !collection.length) {
                    throw Error("The given argument is not an array!");
                }

                this.$_.boundObject = $new($global.joopl.collections.ObservableList, { array: collection });

                return $new($global.joopl.ui.CollectionBinder, { binder: this });
            }
        }
    });
})();