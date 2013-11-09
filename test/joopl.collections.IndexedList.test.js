$manifest.file("joopl.collections.IndexedList.test.js", function () {
    "use strict";

    module("joopl.collections.IndexedList");
    
    test("Create list and add items. Make an indexed search and check that the result contains the expected item", function () {
        $namespace.using("joopl.collections", function() {
            var list = new this.IndexedList();

            list.addIndex(new this.OrderedStringIndex({ source: list, unique: true, property: "text" }));
            list.add({ text: "hello" });
            list.add({ text: "halo" })
            list.add({ text: "world" });
            list.add({ text: "!" });

            var result = list.where({ 
                text: ["hel", "w", "!" ],
                predicate: function(item) { 
                    return item.text.indexOf(this) == 0 || item.text == "halo"; 
                }
            });

            var result2 = list.where(function(item) { return true; });

            ok(result.count(function(item) { return item.text == "hello" }) == 1, "Item found");
            ok(result.count(function(item) { return item.text == "halo" }) == 1, "Item found");
            ok(result.count(function(item) { return item.text == "world" }) == 1, "Item found");
            ok(result.count(function (item) { return item.text == "!" }) == 1, "Item found");
        });
    });
});