var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import moment from "moment";
import imageCompression from 'browser-image-compression';
import { Buffer } from "buffer";
export function sleep(time) {
    return new Promise((resolve) => {
        if (time > 0) {
            setTimeout(() => {
                resolve();
            }, time);
        }
        else {
            resolve();
        }
    });
}
export function selectFile(accept, multiple) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            if (multiple)
                input.setAttribute('multiple', 'true');
            if (accept)
                input.setAttribute('accept', accept);
            input.onchange = (e) => {
                const files = e.target.files || e.dataTransfer.files;
                if (!files.length) {
                    reject(new Error('No File Selected!'));
                }
                else {
                    resolve(files);
                }
            };
            input.click();
        });
    });
}
export function fileToBase64(rawFile, maxSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const converter = (file) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const b = Buffer.from(e.target.result, "base64").length / 1000;
                    if (!maxSize || b <= maxSize) {
                        resolve(e.target.result);
                    }
                    else {
                        reject(`File size of ${b}kB exceeds the max allowed size of ${maxSize}kB`);
                    }
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
                reader.readAsDataURL(file);
            });
        });
        if (rawFile.type.toLowerCase().includes('image') && (rawFile.size / 1000 > (maxSize || 500))) {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920,
                useWebWorker: false
            };
            const compressedFile = yield imageCompression(rawFile, options);
            return yield converter(compressedFile);
        }
        else {
            return yield converter(rawFile);
        }
    });
}
export function selectExcelFile(multiple) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield selectFile("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", multiple);
    });
}
export class SimpleDate {
    static now() {
        return new SimpleDate();
    }
    constructor(params) {
        this.secondsInDay = 86400;
        if (params && typeof params === 'number') {
            this.timestamp = params || 0;
        }
        else if (params && typeof params === "string") {
            this.timestamp = Math.ceil(moment(params).unix() / this.secondsInDay);
        }
        else if (params) {
            const p = params;
            if (p.year && p.month && p.day) {
                this.timestamp = Math.ceil(moment({ year: p.year, month: p.month, day: p.day }).unix() / this.secondsInDay);
            }
            else {
                this.timestamp = Math.ceil(moment().unix() / this.secondsInDay);
            }
        }
        else {
            this.timestamp = Math.ceil(moment().unix() / this.secondsInDay);
        }
    }
    toString() {
        const day = moment.unix(this.timestamp * this.secondsInDay);
        return day.format('YYYY-MM-DD');
    }
    toDateString() {
        return this.toMoment().format('Do MMMM YYYY');
    }
    toShortString() {
        return this.toMoment().format('YYYY-MM-DD');
    }
    toLongString() {
        return this.toMoment().format('dddd, Do MMMM YYYY');
    }
    toNumber() {
        return this.timestamp;
    }
    toSeconds() {
        return this.timestamp * this.secondsInDay;
    }
    toMilliseconds() {
        return this.timestamp * this.secondsInDay * 1000;
    }
    toMoment() {
        return moment.unix(this.toSeconds());
    }
}
export class SimpleTime {
    static now() {
        return new SimpleTime();
    }
    constructor(params) {
        if (params && typeof params === 'number') {
            this.timestamp = params || 0;
        }
        else if (params && typeof params === "string") {
            const pts = params.trim().split(':');
            this.timestamp = Number(pts[0] || 0) * 60 + Number(pts[1] || 0);
        }
        else {
            const pts = new Date().toISOString().split('T')[0].split(':');
            this.timestamp = Number(pts[0] || 0) * 60 + Number(pts[1] || 0);
        }
    }
    toString() {
        const h = Math.floor(this.timestamp / 60);
        const m = this.timestamp % 60;
        return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}`;
    }
    toNumber() {
        return this.timestamp;
    }
}
export const $amt = (v, def) => {
    let vv = v;
    if (v.$numberDecimal !== undefined && v.$numberDecimal !== null)
        vv = v.$numberDecimal;
    try {
        const val = Number(vv);
        if (Number.isNaN(val)) {
            return def || 0;
        }
        return val;
    }
    catch (error) {
        return def || 0;
    }
};
export const $famt = (amount, options) => {
    const v = $amt(amount, options === null || options === void 0 ? void 0 : options.def);
    if (!(v || (options === null || options === void 0 ? void 0 : options.showZeros))) {
        return '';
    }
    if (Number.isNaN(Number(v))) {
        return '';
    }
    const n = (options === null || options === void 0 ? void 0 : options.decimalPlaces) || 2;
    const s = (options === null || options === void 0 ? void 0 : options.thouSep) || ',';
    const c = (options === null || options === void 0 ? void 0 : options.decimalSep) || '.';
    const re = '\\d(?=(\\d{' + 3 + '})+' + (n > 0 ? '\\D' : '$') + ')';
    const num = Number(v).toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
export const toDecimal = (value, decimals) => {
    return { $numberDecimal: Number(value || 0).toFixed(decimals || 2) };
};
export const arrayToObject = (items, options) => {
    const data = {};
    const key = (options === null || options === void 0 ? void 0 : options.key) || '_id';
    let select = (options === null || options === void 0 ? void 0 : options.select) || 'name';
    const asObject = (options === null || options === void 0 ? void 0 : options.asObject) || (Array.isArray(select) && select.length > 0) || (options === null || options === void 0 ? void 0 : options.fullObject);
    for (let i = 0; i < items.length; i++) {
        const k = items[i][key];
        if (k) {
            if (asObject) {
                if (options === null || options === void 0 ? void 0 : options.fullObject) {
                    data[k] = items[i];
                }
                else {
                    if (!Array.isArray(select))
                        select = [select];
                    data[k] = {};
                    for (let s = 0; s < select.length; s++) {
                        data[k][select[s]] = items[i][select[s]];
                    }
                }
            }
            else {
                if (Array.isArray(select))
                    data[k] = items[i][select[0]];
                else
                    data[k] = items[i][select];
            }
        }
    }
    return data;
};
export const dateRangeToPeriod = (dateFrom, dateTo, period) => {
    const df = new SimpleDate(dateFrom).toMoment();
    const dt = new SimpleDate(dateTo).toMoment();
    if (period === 'months') {
        return dt.diff(df, 'months', true);
    }
    if (period === 'days') {
        return dt.diff(df, 'days', true);
    }
    if (period === 'weeks') {
        return dt.diff(df, 'weeks', true);
    }
    if (period === 'years') {
        return dt.diff(df, 'years', true);
    }
    if (period === 'fortnights') {
        return dt.diff(df, 'weeks', true) / 4;
    }
    return 0;
};
export const sortArray = (arr, fields, desc) => {
    arr.sort((a, b) => {
        if (Array.isArray(fields)) {
            for (let i = 0; i < fields.length; i++) {
                if (a[fields[i]] < b[fields[i]])
                    return desc ? 1 : -1;
                if (a[fields[i]] > b[fields[i]])
                    return desc ? -1 : 1;
            }
        }
        else {
            if (a[fields] < b[fields])
                return desc ? 1 : -1;
            if (a[fields] > b[fields])
                return desc ? -1 : 1;
        }
        return 0;
    });
    return arr;
};
const AsyncFunction = (function () {
    return __awaiter(this, void 0, void 0, function* () { });
}).constructor;
const NormalFunction = (function () { }).constructor;
export const computeFunctionalCodeAsync = (code, options) => __awaiter(void 0, void 0, void 0, function* () {
    const evalStr = code;
    const funcBody = options.params ? `return await (async ({${options.params.join(',')}}, __defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)` : `return await (async (__defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)`;
    const func = AsyncFunction(funcBody);
    try {
        const value = options.params ? yield func(options.data || {}, options.defaultValue) : yield func(options.defaultValue);
        return value;
    }
    catch (error) {
        return null;
    }
});
export const computeFunctionalCode = (code, options) => {
    const evalStr = code;
    const funcBody = options.params ? `return (({${options.params.join(',')}}, __defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)` : `return ((__defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)`;
    const func = NormalFunction(funcBody);
    try {
        const value = options.params ? func(options.data || {}, options.defaultValue) : func(options.defaultValue);
        return value;
    }
    catch (error) {
        return null;
    }
};
