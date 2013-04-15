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
                get boundObject() {
                    return this.$_.boundObject;
                },

                /**
                                Gets the HTML element value function predicate
    
                                @property valueFunc 
                                @type Function
                                **/
                get valueFunc() {
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