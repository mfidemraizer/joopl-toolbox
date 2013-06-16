(function() {
    "use strict";

    $manifest.file("joopl.collections.Queue.test.js");

     module("joopl.collections.Queue");
     
     test("Create a queue, enqueue items and check that an item is dequeued in the expected order", function () {
          $namespace.using("joopl.collections", function() {
               var queue = new this.Queue();

               queue.enqueue("hello");
               queue.enqueue("world");
               queue.enqueue("man");
               queue.enqueue("!");

               var item = queue.dequeue();

               ok(item == "hello", "Dequeued item must be the first added one");

               item = queue.dequeue();

               ok(item == "world", "Dequeued item must be the second added one");

               item = queue.dequeue();

               ok(item == "man", "Dequeued item must be the third added one");

               item = queue.dequeue();

               ok(item == "!", "Dequeued item must be the fourth added one");
          });
     });
})();