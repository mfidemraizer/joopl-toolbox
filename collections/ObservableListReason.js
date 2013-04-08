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