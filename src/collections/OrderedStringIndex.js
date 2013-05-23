(function() {
	"use strict";

	$namespace.register("joopl.collections", function() {
		var collections = this;

		this.OrderedStringIndex = $def({
			$extends: collections.Index,
			$constructor: function(args) {
				this.$base.$ctor(args);

				this.$_.partitions = new collections.List();
				this.$_.vocals = "aeiou";
				this.$_.vocalPartitionRegEx = new RegExp("^(a|e|i|o|u|aa|ae|ai|ao|au|ea|ee|ei|eo|eu|ia|ie|io|iu|oa|oe|oi|oo|ou|ua|ue|ui|uo|uu)");
				this.$_.consonantPartitionRegEx = new RegExp("^(b|c|ç|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z)");
				this.$_.numericAndSymbol = new RegExp("^[A-Za-z]")

				this.initialize();
			},

			$members: {
				get vocalPartitionRegEx() { 
					return this.$_.vocalPartitionRegEx;
				},

				get consonantPartitionRegEx() {
					return this.$_.consonantPartitionRegEx;
				},

				initialize: function() {
					var partitions = this.$_.partitions;

					var abc = "abcçdefghijklmnopqrstuvwxyz";
					var vocals = "aeiou";
					var letter = null;
					var vocal = null;

					partitions.add({ id: "other", store: new collections.List() });

					for(var letterIndex in abc) {
						letter = abc[letterIndex];

						if(vocals.indexOf(letter) == 0) {
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
					var indexArgs = { item: this.propertySelectorFunc(args.item) };

					switch(args.changeKind) {
						case collections.ObservableChange.added:
							this.onAdded(indexArgs);
							break;

						case collections.ObservableChange.replaced:
							this.onReplaced(indexArgs);
							break;

						case collections.ObservableChange.removed:
							this.onRemoved(indexArgs);
							break;
					}
				},

				onAdded: function(args) {
					var partition = this.findPartition(args.item);

					if(this.unique) {
						if(partition.store.count(function(item) { return item.value === args.item; }) == 0) {
							partition.store.add(args.item);
						} else {
							throw new $global.joopl.ArgumentException({
								argName: "item",
								reason: "Unique index violation"
							});
						}
					}
				},

				onReplaced: function(args) {

				},

				onRemoved: function(args) {

				},

				where: function(indexedSearch) {		
					var partition = this.findPartition(indexedSearch[this.propertyName]);

					return partition.store.where(indexedSearch.predicate.bind(indexedSearch[this.propertyName]));
				}
			}
		});
	});
})();