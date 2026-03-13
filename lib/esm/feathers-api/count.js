export default function () {
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
