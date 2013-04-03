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
            Represents an event binder. That is, this binder adds an event handler to the HTML element in order to sinchronize with the bound object property value.

            @class EventBinder
            @constructor
            @param binder {PropertyBinder} The property binder.
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
})();