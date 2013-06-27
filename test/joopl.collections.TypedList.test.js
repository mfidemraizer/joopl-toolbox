$manifest.file("joopl.collections.TypedList.test.js", function () {
    "use strict";

    module("joopl.collections.TypedList");

    test("Create list and add items of the list type and also try to add items of other types. Items of other types must be refused", function () {
        $namespace.using("joopl.collections", function () {
            var list = new this.TypedList({ T: String });
            list.add(new String("hello"));
            list.add(new String("world"));
            list.add(new String("!"));
            list.add("");

            throws(function () {
                list.add(1);
            }, "Cannot add items of the wrong type");

            throws(function () {
                list.add({});
            }, "Cannot add items of the wrong type");
        });
    });
});