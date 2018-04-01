"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filetype = require("file-type");
var core_1 = require("@rsi/core");
/**
 * The cdn service provides access to binary data (e.g. images)
 */
var Cdn = /** @class */ (function () {
    function Cdn() {
        this.fileRegistry = { images: {} };
        this.logger = core_1.RsiLogger.getInstance().getLogger("cdn");
    }
    /**
     * The Cdn is a singleton, get an instance by calling the method.
     *
     * @return {Cdn} instance of cdn service
     */
    Cdn.getInstance = function () {
        return this.instance || (this.instance = new this());
    };
    /**
     * This method process es Cdn calls
     *
     * @return {express.RequestHandler} a function that takes a response, request and next argument
     */
    Cdn.prototype.requestHandler = function () {
        var _this = this;
        return function (req, res, next) {
            var origUrl = req.originalUrl;
            if (!req.params.filename) {
                res.status(501);
                res.json({
                    message: "Directory listing not supported",
                    status: "error"
                });
                return;
            }
            var filename = req.params.filename;
            var resourcename = req.params.resource;
            if (_this.fileRegistry[resourcename] && _this.fileRegistry[resourcename][filename]) {
                var img = _this.fileRegistry[resourcename][filename](resourcename, filename);
                res.writeHead(200, {
                    "Content-Length": img.length,
                    "Content-Type": filetype(img).mime
                });
                res.end(img);
            }
            else {
                res.status(404);
                res.send("File not found");
            }
        };
    };
    /**
     * Other services use this method to register callbacks for file access
     *
     * @param resourceName {string} The resource of the file to be made available (e.g. "images")
     * @param fileName {string} The name of the file to be made available
     * @param callback {ICdnCallback} The callback to be called on route access
     *
     * @return {Boolean} true on success
     */
    Cdn.prototype.register = function (resourceName, fileName, callback) {
        this.logger.silly("registering a handler for cdn/" + resourceName + "/" + fileName);
        if (!this.fileRegistry[resourceName]) {
            this.fileRegistry[resourceName] = {};
        }
        var lookup = typeof this.fileRegistry[resourceName][fileName] === "function";
        if (!lookup && typeof callback === "function") {
            // filename not yet registered
            this.fileRegistry[resourceName][fileName] = callback;
            return true;
        }
        return false;
    };
    return Cdn;
}());
exports.Cdn = Cdn;
//# sourceMappingURL=index.js.map