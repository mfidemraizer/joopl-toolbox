$import.modules(["joopl.collections.List.test"], function () {
    "use strict";

    $namespace.register("joopl.collections", function () {
        var collections = this;

        this.declareClass("ListTest", {
            ctor: function () {
                module("joopl.collections.List");
                
                test(
                    "Create list and add items. Checks if the added items exist in the list and if the order is the expected one",
                    this.add_createListAndAddSomeItemsAndCheckIfTheyWereAdded_itemsAddedSuccessfully
                );

                test(
                    "Create list and add multiple items at once. Checks if the added items exist in the list and if the order is the expected one",
                    this.add_createListAndAddSomeItemsAndCheckIfOrderIsTheExpectedOne_itemsAreInOrder
                );

                test(
                    "Create list and add items, and remove ones. Checks if the added items are removed as expected",
                    this.remove_createListAndAddSomeItemsAndRemoveThem_itemsWereRemovedSuccessfully
                );

                test(
                    "Create list and insert items at specified positions. Checks if the added items are in the expected index and order.",
                    this.insertAt_addAndInsertItemsAtSomeIndex_itemsAreInTheExpectedIndexes
                );

                test(
                    "Test Enumerable.forEach()",
                    this.forEach_createListWithItemsAndCheckIfTheyAreIterated_itemsIteratedAsExpected
                );

                test(
                    "Test Enumerable.reverse()",
                    this.reverse_createListWithItemsAndCheckIfOrderGetsReversed_itemsAreReversed
                );

                test(
                    "Test Enumerable.where()",
                    this.where_createListWithItemsAndFilterThem_itemsWereFilteredAsExpected
                );

                test(
                    "Test Enumerable.select()",
                    this.select_createListWithItemsAndProjectThem_itemsWhereProjectedAsExpected
                );

                test(
                    "Test Enumerable.asQueryable()",
                    this.asQueryable_createListWithItemsAndQueueEnumerableOperations_queryableOperationsWereExecutedOnceItGotIterated
                );

                test(
                    "Test Enumerable.first() and Enumerable.first(predicateFunc)",
                    this.first_createListWithItemsAndGetFirstItem_retrievedItemIsTheFirstOne
                );

                test(
                    "Test Enumerable.last() and Enumerable.last(predicateFunc)",
                    this.last_createListWithItemsAndGetLastItem_retrievedItemIsTheLastOne
                );

                test(
                    "Test Enumerable.count() and Enumerable.count(predicateFunc)",
                    this.count_createListWithItemsAndCheckCount_countWasTheExpectedOne
                );

                test(
                    "Test Enumerable.skip()",
                    this.skip_createListWithItemsAndSkipSome_itemsWereSkippedAsExpected
                );
            },

            members: {
                add_createListAndAddSomeItemsAndCheckIfTheyWereAdded_itemsAddedSuccessfully: function () {
                    var list = new collections.List({
                        capacity: 10
                    });
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    ok(list.indexOf("hello") == 0, "Index of first item is 0");
                    ok(list.indexOf("world") == 1, "Index of second item is 1");
                    ok(list.indexOf("!") == 2, "Index of third item is 2");
                },

                add_createListAndAddSomeItemsAndCheckIfOrderIsTheExpectedOne_itemsAreInOrder: function () {
                    var list = new collections.List({
                        capacity: 10
                    });
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    var list2 = new collections.List();
                    list2.addRange(list);

                    ok(list2.indexOf("hello") == 0, "Index of first item is 0");
                    ok(list2.indexOf("world") == 1, "Index of second item is 1");
                    ok(list2.indexOf("!") == 2, "Index of third item is 2");
                },

                remove_createListAndAddSomeItemsAndRemoveThem_itemsWereRemovedSuccessfully: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    list.remove("world");

                    ok(list.indexOf("hello") == 0, "Index of first item is 0");
                    ok(list.indexOf("!") == 1, "Index of third item is 1");

                    list = new collections.List();
                    list.add("blah"); // Removed
                    list.add("blih");
                    list.add("bluh"); // Removed
                    list.add("bloh");
                    list.add("bleh"); // Removed

                    list.removeAt(0);
                    list.removeAt(3);
                    list.removeAt(1);

                    ok(list.indexOf("blah") == -1, "Index of removed item must be -1");
                    ok(list.indexOf("bluh") == -1, "Index of removed item must be -1");
                    ok(list.indexOf("bleh") == -1, "Index of removed item must be -1");
                    ok(list.indexOf("bloh") > -1, "Non-removed item already exists");
                    ok(list.indexOf("blih") > -1, "Non-removed item already exists");
                },

                insertAt_addAndInsertItemsAtSomeIndex_itemsAreInTheExpectedIndexes: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    list.insertAt(0, "begin");
                    list.insertAt(1, "roger");

                    ok(list.indexOf("begin") == 0, "Index of first inserted item is 0");
                    ok(list.indexOf("roger") == 1, "Index of second inserted item is 1");
                },

                forEach_createListWithItemsAndCheckIfTheyAreIterated_itemsIteratedAsExpected: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    list.forEach(function (item) {
                        ok(item == "hello" || item == "world" || item == "!", "All items must be iterated");
                    });
                },

                reverse_createListWithItemsAndCheckIfOrderGetsReversed_itemsAreReversed: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    var reversed = list.reverse();

                    ok(reversed.indexOf("!") == 0, "Index of last added item is 0");
                    ok(reversed.indexOf("world") == 1, "Index of second added item is 1");
                    ok(reversed.indexOf("hello") == 2, "Index of first added item is 2");
                },

                where_createListWithItemsAndFilterThem_itemsWereFilteredAsExpected: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    var result = list.where(function (item) {
                        return item == "!";
                    });

                    ok(result.count() == 1, "Result: 1 item");
                    ok(result.itemAt(0) == "!", "Found item is the expected one");
                },

                select_createListWithItemsAndProjectThem_itemsWhereProjectedAsExpected: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    var result = list.select(function (item) {
                        return {
                            text: item
                        };
                    });

                    ok(result.itemAt(0).text == "hello", "Projected item has the expected form");
                    ok(result.itemAt(1).text == "world", "Projected item has the expected form");
                    ok(result.itemAt(2).text == "!", "Projected item has the expected form");
                },

                asQueryable_createListWithItemsAndQueueEnumerableOperations_queryableOperationsWereExecutedOnceItGotIterated: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    var queryable = list.asQueryable()
                        .where(function (item) {
                            return item == "hello";
                        })
                        .select(function (item) {
                            return {
                                text: item
                            }
                        });

                    var result = queryable.toList();

                    ok(result.itemAt(0).text == "hello", "Found item is the expected one");
                },

                first_createListWithItemsAndGetFirstItem_retrievedItemIsTheFirstOne: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    ok(list.first() == "hello", "The first item is the expected one");
                    ok(list.last(function (item) {
                        return item.indexOf("rl") == 2
                    }), "The selected first item is the expected one");

                    throws(function () {
                        list.first(function (item) {
                            return item == "haha"
                        });
                    }, "No item must be found if the predicate function does not match with any element within the enumerable");

                    var list2 = new collections.List();

                    throws(function () {
                        list2.first();
                    }, "It must throw an exception as the enumerable has no elements");
                },

                last_createListWithItemsAndGetLastItem_retrievedItemIsTheLastOne: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("!");

                    throws(function () {
                        list.last(function (item) {
                            return item == "haha"
                        });
                    }, "No item must be found if the predicate function does not match with any element within the enumerable");

                    ok(list.last() == "!", "It is the expected last item");
                    ok(list.last(function (item) {
                        return item == "!"
                    }) == "!", "It is the expected last item");

                    var list2 = new collections.List();

                    throws(function () {
                        list2.last();
                    }, "It must throw an exception as the enumerable has no elements");
                },

                count_createListWithItemsAndCheckCount_countWasTheExpectedOne: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("man...");
                    list.add("!");

                    ok(list.count() == 4, "The count must match the number of items");
                    ok(list.count(function (item) {
                            return item.indexOf(".") == 3 || item == "!"
                        }) == 2,
                        "The count must match the number of items for the given criteria"
                    );
                    ok(list.count(function (item) {
                        return false
                    }) == 0, "Zero count expected (false criteria)");
                },

                skip_createListWithItemsAndSkipSome_itemsWereSkippedAsExpected: function () {
                    var list = new collections.List();
                    list.add("hello");
                    list.add("world");
                    list.add("man...");
                    list.add("!");

                    var skippedList = list.skip(2);

                    ok(list.count() == 4, "Source list was not modified");
                    ok(skippedList.count() == 2, "Skipped list has expected count");
                    ok(skippedList.itemAt(0) == "man...", "Skipped list has expected item");
                    ok(skippedList.itemAt(1) == "!", "Skipped list has expected item");
                }
            }
        });

        new collections.ListTest();
    });
});