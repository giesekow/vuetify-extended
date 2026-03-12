import { Params } from '@feathersjs/feathers'

export default function () {
  return function (app: any) {
    app.mixins.push(function (service: any) {
      service.count = function (params: Params) {
        params = params || {};
        params.query = params.query || {};
        params.query.$limit = 0;
        return service.find(params).then(function (result: any) {
          return result.total || 0;
        })
      }
    })
  }
}
