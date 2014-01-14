$import.modules("joopl.collections", function () {
    "use strict";

    $namespace.using("joopl.collections", function(collections) {
        collections.declareClass("ObservableListTest", {
            ctor: function() {
                module("joopl.collections.ObservableList");

                test
                (
                    "Create list and add items. Check that changes can be observed", 
                    this.changed_checkChangeEventIsRaisedWhenSomeChangeIsProduced_changeEventWasFired
                );
            },

            members: {
                changed_checkChangeEventIsRaisedWhenSomeChangeIsProduced_changeEventWasFired: function() {
                    var list = new collections.ObservableList();
                    var changeCount = 0;

                    list.changed.addEventListener(function (args) {
                        changeCount++;

                        ok(args.changeKind == collections.ObservableChange.added, "As items are added to the list, the notifier must report that an item was added");
                    });

                    list.add("hello world");
                    list.add("hey hey hey!");
                    list.add("Yeah!!!!!!");

                    ok(changeCount == 3, "The list must notify that it changed three times");
                }
            }
        });

        new collections.ObservableListTest();
    });
});