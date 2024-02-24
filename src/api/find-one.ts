import { Params } from '@feathersjs/feathers'

export default function () {
  return function (app: any) {
    app.mixins.push(function (service: any) {
      service.findOne = async function (params: Params) {
        params = params || {};
        params.query = params.query || {};
        params.query.$limit = 1;
        return service.find(params).then(function (result: any) {
          const data = result.data || result;
          return Array.isArray(data) ? data[0] : data;
        })
      }
    })
  }
}
