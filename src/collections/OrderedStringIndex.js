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
(function() {
	"use strict";

	$namespace.register("joopl.collections", function() {
		var collections = this;

		this.OrderedStringIndex = $def({
			$extends: collections.Index,
			$constructor: function(args) {
				this.$base.$ctor(args);

				this.$_.partitions = new collections.List();
				this.$_.vocalPartitionRegEx = new RegExp("^(a|e|i|o|u|aa|ae|ai|ao|au|ea|ee|ei|eo|eu|ia|ie|io|iu|oa|oe|oi|oo|ou|ua|ue|ui|uo|uu)", "i");
				this.$_.consonantPartitionRegEx = new RegExp("^(b|c|ç|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)", "i");
				this.$_.numericAndSymbol = new RegExp("^[A-Za-z]", "i")

				this.initialize();
			},

			$members: {
				get enumerator() {
					return this.source.enumerator;
				},
				get vocalPartitionRegEx() { 
					return this.$_.vocalPartitionRegEx;
				},

				get consonantPartitionRegEx() {
					return this.$_.consonantPartitionRegEx;
				},

				initialize: function() {
					var partitions = this.$_.partitions;

					var abc = "abcdefghijklmnopqrstuvwxyz";
					var vocals = "aeiou";
					var letter = null;
					var vocal = null;

					partitions.add({ id: "other", store: new collections.List() });

					for(var letterIndex in abc) {
						letter = abc[letterIndex];

						if(vocals.indexOf(letter) == 0) {
							partitions.add({ id: letter, store: new collections.List() });
							
							for(var vocalIndex in vocals) {
								vocal = vocals[vocalIndex];

								partitions.add({ id: letter + vocal, store: new collections.List() });
							}
						} else {
							partitions.add({ id: letter, store: new collections.List() });
						}
					}
				},

				findPartition: function(item) {
					var partitionId = null;

					var isVocal = this.vocalPartitionRegEx.test(item);

					if(isVocal) {
						if(this.vocalPartitionRegEx.test(item.substring(0, 2))) {
							partitionId = item.substring(0, 2);
						} else {
							partitionId = item[0];
						}
					} else if(this.consonantPartitionRegEx.test(item[0])) {
						partitionId = item[0];
					} else {
						partitionId = "other";
					}

					return this.$_.partitions.singleOrNull(function(item) { return item.id == partitionId });
				},

				onDataChange: function(args) {
					switch(args.changeKind) {
						case collections.ObservableChange.added:
							this.onAdded({ item: args.item });
							break;

						case collections.ObservableChange.replaced:
							this.onReplaced({ item: args.item });
							break;

						case collections.ObservableChange.removed:
							this.onRemoved({ item: args.item });
							break;
					}
				},

				onAdded: function(args) {
					var propertyName = this.property;
					var searchValue = args.item[propertyName];
					var propertySelectorFunc = this.propertySelectorFunc;
					var partition = this.findPartition(searchValue);

					if(this.unique) {
						if(partition.store.count(function(storeItem) { return storeItem[propertyName] === searchValue; }) == 0) {
							partition.store.add(args.item);
						} else {
							throw new $global.joopl.ArgumentException({
								argName: "item",
								reason: "Unique index violation"
							});
						}
					} else {
						partition.store.add(args.item);
					}
				},

				onReplaced: function(args) {
					var partition = this.findPartition(args.item);

					if(this.unique) {
						if(partition.store.count(function(item) { return item.value == args.item }) > 0) {
							throw new $global.joopl.ArgumentException({
								argName: "item",
								reason: "Unique index violation"
							});
						}
					}

					var replacedItemIndex = partition.store.indexOf(args.oldItem);
					partition.store.replaceAt(replacedItemIndex, args.item);
				},

				onRemoved: function(args) {
					var partition = this.findPartition(args.item);

					var removedItemIndex = partition.store.indexOf(args.item);
					partition.store.removeAt(replacedItemIndex);
				},

				forEach: function(predicateFunc) {
					throw new $global.joopl.NotImplementedException();
				},

				reverse: function() {
					throw new $global.joopl.NotImplementedException();
				},

				single: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.single(predicateFunc.bind(propertySelector[this.property]));
				},

				singleOrNull: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.singleOrNull(predicateFunc.bind(propertySelector[this.property]));
				},

				first: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.first(predicateFunc.bind(propertySelector[this.property]));
				},

				firstOrNull: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.firstOrNull(predicateFunc.bind(propertySelector[this.property]));
				},

				last: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.last(predicateFunc.bind(propertySelector[this.property]));
				},

				lastOrNull: function (propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.lastOrNull(predicateFunc.bind(propertySelector[this.property]));
				},

				count: function(propertySelector, predicateFunc) {
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.count(predicateFunc.bind(propertySelector[this.property]));
				},

				where: function(propertySelector, predicateFunc) {		
					var partition = this.findPartition(propertySelector[this.property]);

					return partition.store.where(predicateFunc.bind(propertySelector[this.property]));
				}
			}
		});
	});
})();