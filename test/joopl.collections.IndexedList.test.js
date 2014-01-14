$import.modules("joopl.collections", function () {
    "use strict";

    $namespace.using("joopl.collections", function(collections) {
        collections.declareClass("IndexedListTest", {
            ctor: function () {
                module("joopl.collections.IndexedList");
                
                test
                (
                    "Create list and add items. Make an indexed search and check that the result contains the expected item", 
                    this.addItems_doIndexedSearch_itemsWereFound
                );
            },

            members: {
                addItems_doIndexedSearch_itemsWereFound: function() {
                    var list;
                    var index = new collections.OrderedStringIndex({ source: (list = new collections.IndexedList()), unique: true, property: "text" });

                    list.addIndex(index);
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
                }
            }
        });

        new collections.IndexedListTest();
    });
});