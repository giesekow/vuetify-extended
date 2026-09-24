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
exports.finishDialogEntry = void 0;
const vue_1 = require("vue");
/** Vuetify can emit after-enter before the browser finishes its CSS transform. */
function finishDialogEntry(content) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, vue_1.nextTick)();
        const animations = ((_a = content === null || content === void 0 ? void 0 : content.getAnimations) === null || _a === void 0 ? void 0 : _a.call(content).filter(animation => {
            var _a;
            return animation.playState === 'running' &&
                Number.isFinite((_a = animation.effect) === null || _a === void 0 ? void 0 : _a.getComputedTiming().endTime);
        })) || [];
        const results = yield Promise.allSettled(animations.map(animation => animation.finished));
        // A cancelled entry must not release a stale popup request.
        return results.every(result => result.status === 'fulfilled');
    });
}
exports.finishDialogEntry = finishDialogEntry;
