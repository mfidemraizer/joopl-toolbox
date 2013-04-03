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

(function () {
    "use strict";

    /** 
            # User interface data-binding

            @module User interface data-binding
        */

    /**
        @namespace joopl.ui
        */
    $namespace.register("joopl.ui");

    /**
            Represents a property binder. That is, this binder binds a property of the bound object..

            @class PropertyBinder
            @constructor
            @param binder {Binder} The binder.
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
})();