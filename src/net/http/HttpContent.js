(function() {
    "use strict";

    $namespace.register("joopl.net.http", function () {
        this.HttpContent = $def({
            $constructor: function (args) {
                this.$_.data = args.data;
                this.$_.type = args.type;
            },
            $members: {
                get data() { return this.$_.data; },
                set data(value) { this.$_.data = value; },

                get type() { return this.$_.type; },
                set type(value) { this.$_.type = value; },

                toString: function () {
                    return this.data
                }
            }
        })
    });
})();