"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return function (app) {
        app.mixins.push(function (service) {
            service.count = function (params) {
                params = params || {};
                params.query = params.query || {};
                params.query.$limit = 0;
                return service.find(params).then(function (result) {
                    return result.total || 0;
                });
            };
        });
    };
}
exports.default = default_1;
