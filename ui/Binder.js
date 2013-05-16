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