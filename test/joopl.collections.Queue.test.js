$import.modules("joopl.collections", function () {
    "use strict";

    $namespace.using("joopl.collections", function(collections) {
        collections.declareClass("QueueTest", {
            ctor: function() {
                module("joopl.collections.Queue");
                
                test
                (
                    "Create a queue, enqueue items and check that an item is dequeued in the expected order", 
                    this.enqueue_enqueueSomeItemsAndDequeueOne_dequeuedItemWasTheExpectedOne
                );
            },

            members: {
                enqueue_enqueueSomeItemsAndDequeueOne_dequeuedItemWasTheExpectedOne: function() {
                    var queue = new collections.Queue();

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
                }
            }
        });

        new collections.QueueTest();
    });
});