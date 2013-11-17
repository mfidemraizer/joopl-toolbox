$import.modules(["joopl.collections"], function () {
    "use strict";

    module("joopl.collections.ObservableList");

    test("Create list and add items. Check that changes can be observed.", function () {
        $namespace.using("joopl.collections", function () {
            var list = new this.ObservableList();
            var collections = this;

            var changeCount = 0;

            list.changed.addEventListener(function (args) {
                changeCount++;

                ok(args.changeKind == collections.ObservableChange.added, "As items are added to the list, the notifier must report that an item was added");
            });

            list.add("hello world");
            list.add("hey hey hey!");
            list.add("Yeah!!!!!!");

            ok(changeCount == 3, "The list must notify that it changed three times");
        });
    });
});