(function() {
    "use strict";

    $manifest.file("net/http/HttpResponseMessage.js");

    $namespace.register("joopl.net.http", function () {
        this.HttpResponseMessage = $def({
            $constructor: function (args) {
                this.$_.data = args.data;
                this.$_.statusText = args.statusText;
                this.$_.statusCode = args.statusCode;
                this.$_.XHR = args.xhr;
                this.$_.error = args.error
                this.$_.context = args.context;

            },
            $members: {
                get data() { return this.$_.data; },
                set data(value) { this.$_.data = value; },

                get statusText() { return this.$_.statusText; },
                set statusText(value) { this.$_.statusText = value; },

                get statusCode() { return this.$_.statusCode; },
                set statusCode(value) { this.$_.statusCode = value; },

                get XHR() { return this.$_.XHR; },
                set XHR(value) { this.$_.XHR = value; },

                get error() { return this.$_.error; },
                set error(value) { this.$_.error = value; },

                get context() { return this.$_.context; },
                set context(value) { this.$_.context = value; }
            }
        })
    });
})();