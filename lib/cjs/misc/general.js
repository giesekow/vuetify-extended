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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.$moment = exports.renderMathInHtml = exports.computeFunctionalCode = exports.computeFunctionalCodeAsync = exports.sortArray = exports.dateRangeToPeriod = exports.arrayToObject = exports.toDecimal = exports.$zFill = exports.$famt = exports.$amt = exports.SimpleTime = exports.SimpleDate = exports.selectExcelFile = exports.fileToBase64 = exports.selectFile = exports.sleep = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const browser_image_compression_1 = __importDefault(require("browser-image-compression"));
const buffer_1 = require("buffer");
const katex_1 = __importDefault(require("katex"));
require("katex/dist/katex.min.css");
const master_1 = require("../master");
function sleep(time) {
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
exports.sleep = sleep;
function selectFile(accept, multiple) {
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
exports.selectFile = selectFile;
function fileToBase64(rawFile, maxSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const converter = (file) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const b = buffer_1.Buffer.from(e.target.result, "base64").length / 1024;
                    if (!maxSize || b <= maxSize) {
                        resolve(e.target.result);
                    }
                    else {
                        reject(new Error(`File size of ${b}kB exceeds the max allowed size of ${maxSize}kB`));
                    }
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
                reader.readAsDataURL(file);
            });
        });
        if (rawFile.type.toLowerCase().includes('image') && (rawFile.size / 1024 > (maxSize || 500))) {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920,
                useWebWorker: false
            };
            const compressedFile = yield (0, browser_image_compression_1.default)(rawFile, options);
            return yield converter(compressedFile);
        }
        else {
            return yield converter(rawFile);
        }
    });
}
exports.fileToBase64 = fileToBase64;
function selectExcelFile(multiple) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield selectFile("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", multiple);
    });
}
exports.selectExcelFile = selectExcelFile;
class SimpleDate {
    static now() {
        return new SimpleDate();
    }
    static fromMoment(m) {
        const timestamp = Math.ceil(m.unix() / 86400);
        return new SimpleDate(timestamp);
    }
    constructor(params) {
        this.secondsInDay = 86400;
        if (params instanceof SimpleDate) {
            this.timestamp = params.toNumber();
        }
        else if (params && typeof params === 'number') {
            this.timestamp = params || 0;
        }
        else if (params && typeof params === "string") {
            this.timestamp = Math.ceil((0, moment_timezone_1.default)(params).unix() / this.secondsInDay);
        }
        else if (params) {
            const p = params;
            if (p.year && p.month && p.day) {
                this.timestamp = Math.ceil((0, moment_timezone_1.default)({ year: p.year, month: p.month, day: p.day }).unix() / this.secondsInDay);
            }
            else {
                this.timestamp = Math.floor((0, moment_timezone_1.default)().unix() / this.secondsInDay);
            }
        }
        else {
            this.timestamp = Math.floor((0, moment_timezone_1.default)().unix() / this.secondsInDay);
        }
    }
    toString() {
        const day = moment_timezone_1.default.unix(this.timestamp * this.secondsInDay);
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
        return moment_timezone_1.default.unix(this.toSeconds());
    }
    atTime(time, timezone) {
        const dtStr = this.toMoment().format('YYYY-MM-DD');
        const tmStr = time instanceof SimpleTime ? time.toString() : new SimpleTime(time).toString();
        return moment_timezone_1.default.tz(`${dtStr} ${tmStr}`, timezone || moment_timezone_1.default.tz.guess());
    }
}
exports.SimpleDate = SimpleDate;
class SimpleTime {
    static now() {
        return new SimpleTime();
    }
    constructor(params) {
        if (params instanceof SimpleTime) {
            this.timestamp = params.toNumber();
        }
        else if (params && typeof params === 'number') {
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
    onDate(date, timezone) {
        const dtStr = date instanceof SimpleDate ? date.toMoment().format('YYYY-MM-DD') : new SimpleDate(date).toMoment().format('YYYY-MM-DD');
        const tmStr = this.toString();
        return moment_timezone_1.default.tz(`${dtStr} ${tmStr}`, timezone || moment_timezone_1.default.tz.guess());
    }
}
exports.SimpleTime = SimpleTime;
const $amt = (v, def) => {
    if (!v && v !== 0)
        return def || 0;
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
exports.$amt = $amt;
const $famt = (amount, options) => {
    const v = (0, exports.$amt)(amount, options === null || options === void 0 ? void 0 : options.def);
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
exports.$famt = $famt;
const $zFill = (v, precision) => {
    if (!precision || precision <= 0)
        return String(v);
    return String(v).padStart(precision, '0');
};
exports.$zFill = $zFill;
const toDecimal = (value, decimals) => {
    return { $numberDecimal: Number(value || 0).toFixed(decimals || 2) };
};
exports.toDecimal = toDecimal;
const arrayToObject = (items, options) => {
    const data = {};
    const key = (options === null || options === void 0 ? void 0 : options.key) || master_1.Master.resolveItemValueField(items);
    let select = (options === null || options === void 0 ? void 0 : options.select) || 'name';
    const asObject = (options === null || options === void 0 ? void 0 : options.asObject) || (Array.isArray(select) && select.length > 0) || (options === null || options === void 0 ? void 0 : options.fullObject);
    for (let i = 0; i < items.length; i++) {
        const k = master_1.Master.getValueByField(items[i], key);
        if (k || k === 0) {
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
exports.arrayToObject = arrayToObject;
const dateRangeToPeriod = (dateFrom, dateTo, period) => {
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
exports.dateRangeToPeriod = dateRangeToPeriod;
const sortArray = (arr, fields, desc) => {
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
exports.sortArray = sortArray;
const computeFunctionalCodeAsync = (code, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { params = [], data = {}, defaultValue } = options;
    // Create an Function with parameters directly
    const func = new Function(...params, "__defaultValue", `
      return async () => {
        try {   
          ${code}
        } catch (error) {
          return __defaultValue;
        }
        return __defaultValue;
      }
    `);
    try {
        // Call it with data values spread + defaultValue
        const args = params.map(p => data[p]);
        const value = yield (func(...args, defaultValue))();
        return value;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.computeFunctionalCodeAsync = computeFunctionalCodeAsync;
const computeFunctionalCode = (code, options) => {
    const { params = [], data = {}, defaultValue } = options;
    // Build the function directly, no extra 'return'
    const func = new Function(...params, "__defaultValue", `
      try {
        ${code}
      } catch (error) {
        return __defaultValue;
      }
      return __defaultValue;
    `);
    try {
        // Map data to parameters
        const args = params.map(p => data[p]);
        return func(...args, defaultValue);
    }
    catch (error) {
        console.error(error);
        return defaultValue;
    }
};
exports.computeFunctionalCode = computeFunctionalCode;
const renderMathInHtml = (html) => {
    // Render display math first ($$...$$)
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
        try {
            return katex_1.default.renderToString(math, { displayMode: true });
        }
        catch (err) {
            return `<span class="katex-error">${math}</span>`;
        }
    });
    // Render inline math ($...$)
    html = html.replace(/\$([^\$]+?)\$/g, (_, math) => {
        try {
            return katex_1.default.renderToString(math, { displayMode: false });
        }
        catch (err) {
            return `<span class="katex-error">${math}</span>`;
        }
    });
    return html;
};
exports.renderMathInHtml = renderMathInHtml;
exports.$moment = moment_timezone_1.default;
