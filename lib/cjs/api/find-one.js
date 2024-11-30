"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return function (app) {
        app.mixins.push(function (service) {
            service.findOne = function (params) {
                return __awaiter(this, void 0, void 0, function* () {
                    params = params || {};
                    params.query = params.query || {};
                    params.query.$limit = 1;
                    return service.find(params).then(function (result) {
                        const data = result.data || result;
                        return Array.isArray(data) ? data[0] : data;
                    });
                });
            };
        });
    };
}
exports.default = default_1;
