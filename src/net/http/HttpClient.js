(function() {
    "use strict";

    $namespace.register("joopl.net.http", function () {
        this.HttpClient = $def({
            $constructor: function (args) {
                this.$_.baseAddress = "";
            },
            $members: {
                get baseAddress() { return this.$_.baseAddress; },
                set baseAddress(value) { this.$_.baseAddress = value; },

                getAsync: function (url, options) {
                    throw new $global.joopl.NotImplementedException();
                },

                postAsync: function (url, options) {
                    throw new $global.joopl.NotImplementedException();
                },

                deleteAsync: function (url, options) {
                    throw new $global.joopl.NotImplementedException();
                },

                putAsync: function (url, options) {
                    throw new $global.joopl.NotImplementedException();
                },

                patchAsync: function (url, options) {
                    throw new $global.joopl.NotImplementedException();
                }
            }
        })
    });
})();