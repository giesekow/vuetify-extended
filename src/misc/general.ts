import moment, { Moment } from "moment-timezone";
import imageCompression from 'browser-image-compression';
import { Buffer } from "buffer";
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function sleep(time: number) {
  return new Promise((resolve: any) => {
    if (time > 0) {
      setTimeout(() => {
        resolve();
      }, time);
    } else {
      resolve();
    }
  });
}
  
export async function selectFile(accept?: any, multiple?: boolean): Promise<FileList> {
  return new Promise((resolve : any, reject: any) =>{
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    if (multiple) input.setAttribute('multiple', 'true');
    if (accept) input.setAttribute('accept', accept);
    input.onchange = (e: any) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        reject(new Error('No File Selected!'));
      } else {
        resolve(files);
      }
    };
    input.click();
  })
}

export async function fileToBase64 (rawFile: File, maxSize?: any) {

  const converter = async (file: File) => {
    return new Promise((resolve : any, reject: any) => {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const b = Buffer.from(e.target.result, "base64").length / 1024;
        if (!maxSize || b <= maxSize) {
          resolve(e.target.result);
        } else {
          reject(new Error(`File size of ${b}kB exceeds the max allowed size of ${maxSize}kB`));
        }
      }
  
      reader.onerror = () => {
        reject(reader.error);
      }

      reader.readAsDataURL(file);
    })
  }

  if (rawFile.type.toLowerCase().includes('image') && (rawFile.size / 1024 > (maxSize || 500))) {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: false
    }

    const compressedFile = await imageCompression(rawFile, options);
    return await converter(compressedFile);
  } else {
    return await converter(rawFile);
  }
}

export async function selectExcelFile(multiple?: boolean) {
  return await selectFile("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", multiple);
}

export interface SimpleDateParams {
  year: number,
  month: number,
  day: number,
}

export class SimpleDate {

  private timestamp: number;
  private secondsInDay = 86400;

  static now(): SimpleDate {
    return new SimpleDate();
  }

  static fromMoment(m: Moment): SimpleDate {
    const timestamp = Math.ceil(m.unix() / 86400);
    return new SimpleDate(timestamp);
  }

  constructor(params?: SimpleDateParams|number|string|Moment|SimpleDate) {
    if (params instanceof SimpleDate) {
      this.timestamp = params.toNumber()
    } else if (params && typeof params === 'number') {
      this.timestamp = params || 0;
    } else if (params && typeof params === "string") {
      this.timestamp = Math.ceil(moment(params).unix() / this.secondsInDay);
    } else if (params) {
      const p: any = params;
      if (p.year && p.month && p.day) {
        this.timestamp = Math.ceil(moment({year: p.year, month: p.month, day: p.day}).unix() / this.secondsInDay);
      } else {
        this.timestamp = Math.floor(moment().unix() / this.secondsInDay);
      }
    } else {
      this.timestamp = Math.floor(moment().unix() / this.secondsInDay);
    }
  }

  toString() {
    const day = moment.unix(this.timestamp * this.secondsInDay);
    return day.format('YYYY-MM-DD')
  }

  toDateString() {
    return this.toMoment().format('Do MMMM YYYY')
  }

  toShortString() {
    return this.toMoment().format('YYYY-MM-DD')
  }

  toLongString() {
    return this.toMoment().format('dddd, Do MMMM YYYY')
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

  atTime(time: number|SimpleTime, timezone?: string) {
    const dtStr = this.toMoment().format('YYYY-MM-DD')
    const tmStr = time instanceof SimpleTime ? time.toString() : new SimpleTime(time).toString()
    return moment.tz(`${dtStr} ${tmStr}`, timezone || moment.tz.guess())
  }
}

export class SimpleTime {

  private timestamp: number;

  static now(): SimpleTime {
    return new SimpleTime();
  }

  constructor(params?: number|string|SimpleTime) {
    if (params instanceof SimpleTime) {
      this.timestamp = params.toNumber()
    } else if (params && typeof params === 'number') {
      this.timestamp = params || 0;
    } else if (params && typeof params === "string") {
      const pts = params.trim().split(':');
      this.timestamp = Number(pts[0] || 0) * 60 + Number(pts[1] || 0);
    } else {
      const pts = new Date().toISOString().split('T')[0].split(':');
      this.timestamp = Number(pts[0] || 0) * 60 + Number(pts[1] || 0);
    }
  }

  toString() {
    const h = Math.floor(this.timestamp / 60);
    const m = this.timestamp % 60;
    return `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}`: m}`;
  }

  toNumber() {
    return this.timestamp;
  }

  onDate(date: number|SimpleDate, timezone?: string) {
    const dtStr = date instanceof SimpleDate ? date.toMoment().format('YYYY-MM-DD') : new SimpleDate(date).toMoment().format('YYYY-MM-DD')
    const tmStr = this.toString()
    return moment.tz(`${dtStr} ${tmStr}`, timezone || moment.tz.guess())
  }
}

export const $amt = (v: any, def?: number): number => {
  if (!v && v !== 0) return def || 0
  let vv = v;
  if (v.$numberDecimal !== undefined && v.$numberDecimal !== null) vv = v.$numberDecimal;
  try {
    const val = Number(vv);
    if (Number.isNaN(val)) {
      return def || 0;  
    }
    return val;
  } catch (error) {
    return def || 0;
  }
}

export interface fAmtOptions {
  decimalPlaces?: number;
  showZeros?: boolean;
  def?: number;
  thouSep?: string;
  decimalSep?: string;
}

export const $famt = (amount: any, options?: fAmtOptions) => {
  const v = $amt(amount, options?.def);
  if (!(v || options?.showZeros)) {
    return ''
  }

  if (Number.isNaN(Number(v))) {
    return '';
  }

  const n = options?.decimalPlaces || 2
  const s = options?.thouSep || ','
  const c = options?.decimalSep || '.'
  const re = '\\d(?=(\\d{' + 3 + '})+' + (n > 0 ? '\\D' : '$') + ')'
  const num = Number(v).toFixed(Math.max(0, ~~n));
  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
}

export const $zFill = (v: any, precision?: number): string => {
  if (!precision || precision <= 0) return String(v)
  return String(v).padStart(precision, '0')
}

export const toDecimal = (value: any, decimals?: number) => {
  return {$numberDecimal: Number(value || 0).toFixed(decimals || 2)};
}

export interface arrayToObjectOptions {
  key?: string;
  select?: string|string[];
  fullObject?: boolean;
  asObject?: boolean;
  format?: (item: any) => any;
}

export const arrayToObject = (items: any[], options?: arrayToObjectOptions) => {
  const data: any = {};
  const key = options?.key || '_id';
  let select = options?.select || 'name';

  const asObject = options?.asObject || (Array.isArray(select) && select.length > 0) || options?.fullObject;

  for(let i = 0; i < items.length; i++) {
    const k = items[i][key];
    if (k) {
      if (asObject) {
        if (options?.fullObject) {
          data[k] = items[i];
        } else {
          if (!Array.isArray(select)) select = [select];
          data[k] = {}
          for(let s = 0; s < select.length; s++) {
            data[k][select[s]] = items[i][select[s]]
          }
        }
      } else {
        if (Array.isArray(select)) data[k] = items[i][select[0]];
        else  data[k] = items[i][select];
      }
    }
  }

  return data;
}

export const dateRangeToPeriod = (dateFrom: any, dateTo: any, period: any): number => {

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
}

export const sortArray = (arr: any[], fields: any, desc?: boolean): any[] => {
  arr.sort((a: any, b: any) => {
    if (Array.isArray(fields)) {
      for (let i = 0; i < fields.length; i++) {
        if (a[fields[i]] < b[fields[i]]) return desc ? 1 : -1;
        if (a[fields[i]] > b[fields[i]]) return desc ? -1 : 1;  
      }
    } else {
      if (a[fields] < b[fields]) return desc ? 1 : -1;
      if (a[fields] > b[fields]) return desc ? -1 : 1;
    }
    return 0;
  });
  return arr;
}

const AsyncFunction = (async function() {}).constructor;
const NormalFunction = (function() {}).constructor;

export interface computeFunctionOptions {
  params?: any[];
  data?: any;
  defaultValue?: any;
}

export const computeFunctionalCodeAsync = async (code: string, options: computeFunctionOptions): Promise<any> => {
  const evalStr: string = code;
  const funcBody = options.params ? `return await (async ({${options.params.join(',')}}, __defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)` : `return await (async (__defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)`;
  const func = AsyncFunction(funcBody);
  try {
    const value = options.params ? await func(options.data || {}, options.defaultValue) : await func(options.defaultValue);
    return value;
  } catch (error) {
    return null;
  }
}

export const computeFunctionalCode = (code: string, options: computeFunctionOptions): any => {
  const evalStr: string = code;
  const funcBody = options.params ? `return (({${options.params.join(',')}}, __defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)` : `return ((__defaultValue) => {  try { ${evalStr} } catch (error) { return __defaultValue; } return __defaultValue; })(...arguments)`;
  const func = NormalFunction(funcBody);
  try {
    const value = options.params ? func(options.data || {}, options.defaultValue) : func(options.defaultValue);
    return value;
  } catch (error) {
    return null;
  }
}

export const renderMathInHtml = (html: string): string => {
  // Render display math first ($$...$$)
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: true });
    } catch (err) {
      return `<span class="katex-error">${math}</span>`;
    }
  });

  // Render inline math ($...$)
  html = html.replace(/\$([^\$]+?)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: false });
    } catch (err) {
      return `<span class="katex-error">${math}</span>`;
    }
  });

  return html;
}

export const $moment = moment;