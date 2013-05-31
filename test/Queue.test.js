(function() {
     test("Create a queue, enqueue items and check that an item is dequeued in the expected order", function () {
          var collections = $namespace.using("joopl.collections");

               var queue = new collections.Queue();

               queue.enqueue("hello");
               queue.enqueue("world");
               queue.enqueue("man");
               queue.enqueue("!");

               ok(item == "hello", "Dequeued item must be the first added one");

               var item = queue.dequeue();

               item = queue.dequeue();

               ok(item == "world", "Dequeued item must be the second added one");

               item = queue.dequeue();

               ok(item == "man", "Dequeued item must be the third added one");

               item = queue.dequeue();

               ok(item == "!", "Dequeued item must be the fourth added one");
     });
})();