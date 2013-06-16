(function() { 
    "use strict";

    $manifest.file("net/http/StringContent.js");

    $namespace.register("joopl.net.http", function () {
        this.StringContent = $def({
            $extends: this.HttpContent,
            $constructor: function (args) {
                this.$base.$ctor(args)
            },
        })
    });
})();