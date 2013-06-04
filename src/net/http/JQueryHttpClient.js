(function() {
    "use strict";

    $namespace.register("joopl.net.http", function () {
        this.JQueryHttpClient = $def({
            $extends: this.HttpClient,
            $constructor: function (args) {
                this.$base.$ctor(args)
            },
            $members: {

                getAsync: function (url, options) {
                    return this.sendAsync(url, "GET", options)
                },

                postAsync: function (url, options) {
                    return this.sendAsync(url, "POST", options)
                },

                deleteAsync: function (url, options) {
                    return this.sendAsync(url, "DELETE", options)
                },

                putAsync: function (url, options) {
                    return this.sendAsync(url, "PUT", options)
                },

                patchAsync: function (url, options) {
                    return this.sendAsync(url, "PATCH", options)
                },

                sendAsync: function (url, verb, options) {
                    if (typeof options.content == "object" && options.content.isTypeOf($global.joopl.net.http.HttpContent)) {
                        jQuery.support.cors = true
                        this.createTransport();
                        var dfr = new jQuery.Deferred()
                        return $.when($.ajax({ type: verb, url: this.baseAddress + url, data: options.content.toString(), contentType: options.content.type, dataType: "text" })).then(
                            function (data, status, xhr) {
                                return dfr.resolve(new $global.joopl.net.http.HttpResponseMessage({ data: data, statusText: status, statusCode: xhr.status, xhr: xhr, error: null, context: this }))
                            },
                            function (xhr, status, error) {
                                return dfr.reject(new $global.joopl.net.http.HttpResponseMessage({ data: null, statusText: status, statusCode: xhr.status, xhr: xhr, error: error, context: this }))
                            })
                    } else {
                        throw new $global.joopl.ArgumentException({ argName: "JQueryHttpClient", reason: "the type of options parameter must be a HttpContent." })
                    }
                },
                createTransport: function () {

                    // jQuery.XDomainRequest.js
                    // Author: Jason Moon - @JSONMOON
                    // IE8+
                    if (jQuery.support.cors && window.XDomainRequest) {
                        var httpRegEx = /^https?:\/\//i;
                        var getOrPostRegEx = /^get|post$/i;
                        var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
                        var xmlRegEx = /\/xml/i;

                        // ajaxTransport exists in jQuery 1.5+
                        jQuery.ajaxTransport('text html xml json', function (options, userOptions, jqXHR) {
                            // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
                            if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && sameSchemeRegEx.test(userOptions.url)) {
                                var xdr = null;
                                var userType = (userOptions.dataType || '').toLowerCase();
                                return {
                                    send: function (headers, complete) {
                                        xdr = new XDomainRequest();
                                        if (/^\d+$/.test(userOptions.timeout)) {
                                            xdr.timeout = userOptions.timeout;
                                        }
                                        xdr.ontimeout = function () {
                                            complete(500, 'timeout');
                                        };
                                        xdr.onload = function () {
                                            var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                                            var status = {
                                                code: 200,
                                                message: 'success'
                                            };
                                            var responses = {
                                                text: xdr.responseText
                                            };
                                            /*
                                            if (userType === 'html') {
                                                responses.html = xdr.responseText;
                                            } else
                                            */
                                            try {
                                                if (userType === 'json') {
                                                    try {
                                                        responses.json = JSON.parse(xdr.responseText);
                                                    } catch (e) {
                                                        status.code = 500;
                                                        status.message = 'parseerror';
                                                        //throw 'Invalid JSON: ' + xdr.responseText;
                                                    }
                                                } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                                    var doc = new ActiveXObject('Microsoft.XMLDOM');
                                                    doc.async = false;
                                                    try {
                                                        doc.loadXML(xdr.responseText);
                                                    } catch (e) {
                                                        doc = undefined;
                                                    }
                                                    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                                        status.code = 500;
                                                        status.message = 'parseerror';
                                                        throw 'Invalid XML: ' + xdr.responseText;
                                                    }
                                                    responses.xml = doc;
                                                }
                                            } catch (parseMessage) {
                                                throw parseMessage;
                                            } finally {
                                                complete(status.code, status.message, responses, allResponseHeaders);
                                            }
                                        };
                                        xdr.onerror = function () {
                                            complete(500, 'error', {
                                                text: xdr.responseText
                                            });
                                        };
                                        xdr.open(options.type, options.url);
                                        //xdr.send(userOptions.data);
                                        xdr.send();
                                    },
                                    abort: function () {
                                        if (xdr) {
                                            xdr.abort();
                                        }
                                    }
                                };
                            }
                        });
                    }
                }
            }
        })
    })
})();