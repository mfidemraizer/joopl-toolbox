/*
 Copyright Matias Fidemraizer
 http://matiasfidemraizer.com
 http://www.linkedin.com/in/mfidemraizer/en

 jOOPL Toolbox
 https://github.com/mfidemraizer/joopl-toolbox

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
  <h2>Index of contents</h2>
  
  - <a href="#intro">Introduction to JavaScript collections</a>
  - <a href="#enumerables">Enumerables and iterators</a>


  <h3 id="intro">Introduction to JavaScript collections</h3>

  **Collections** module introduces concrete data structures to store regular JavaScript objects. 

  <h3 id="enumerables">Enumerables and iterators</h3>

  Any collection of objects within the framework inherits {{#crossLink "joopl.collections.Enumerable"}}{{/crossLink}}, which provides iterators and aggregate
  functions to perform iterations and common operations (see {{#crossLink "joopl.collections.Enumerable"}}{{/crossLink}} documentation to learn more about available
  operations).
  
  For example, a {{#crossLink "joopl.collections.List"}}{{/crossLink}} may add "Chris", "Sarah", "John" items:

      $namespace.using("joopl.collections", function() {
        var list = new this.List();
        list.add("Chris");
        list.add("Sarah");
        list.add("John");
      });

  Now it could be needed to perform some search. For examle take any element that contains the "h" letter would be implemented this way under regular JavaScript:

      $namespace.using("joopl.collections", function() {
        var list = new this.List();
        list.add("Chris");
        list.add("Sarah");
        list.add("John");

        var index = 0;

        // This list will hold found items
        var wordsStartingWithHLetter = new this.List();

        while(index < list.count()) {
            if(list.itemAt(index).indexOf("h") >= 0) {
              wordsStartingWithHLetter.add(list.itemAt(index));
            }

            index++;
        }
      });

  With {{#crossLink "joopl.collections.Enumerable"}}{{/crossLink}} iterators, above code can be reduced into the next code listing using 
  the {{#crossLink "joopl.collections.Enumerable/where:method"}}{{/crossLink}} method:

      $namespace.using("joopl.collections", function() {
        var list = new this.List();
        list.add("Chris");
        list.add("Sarah");
        list.add("John");

        var index = 0;

        // This list will hold found items
        var wordsStartingWithHLetter = list.where(function(item) { 
          return item.indexOf("h") >= 0;
        });
      });


	@module Collections
	@main
*/
