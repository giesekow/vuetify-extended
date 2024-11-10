import moment, { Moment } from "moment-timezone";
export declare function sleep(time: number): Promise<unknown>;
export declare function selectFile(accept?: any, multiple?: boolean): Promise<FileList>;
export declare function fileToBase64(rawFile: File, maxSize?: any): Promise<unknown>;
export declare function selectExcelFile(multiple?: boolean): Promise<FileList>;
export interface SimpleDateParams {
    year: number;
    month: number;
    day: number;
}
export declare class SimpleDate {
    private timestamp;
    private secondsInDay;
    static now(): SimpleDate;
    static fromMoment(m: Moment): SimpleDate;
    constructor(params?: SimpleDateParams | number | string | Moment | SimpleDate);
    toString(): string;
    toDateString(): string;
    toShortString(): string;
    toLongString(): string;
    toNumber(): number;
    toSeconds(): number;
    toMilliseconds(): number;
    toMoment(): moment.Moment;
    atTime(time: number | SimpleTime, timezone?: string): moment.Moment;
}
export declare class SimpleTime {
    private timestamp;
    static now(): SimpleTime;
    constructor(params?: number | string | SimpleTime);
    toString(): string;
    toNumber(): number;
    onDate(date: number | SimpleDate, timezone?: string): moment.Moment;
}
export declare const $amt: (v: any, def?: number) => number;
export interface fAmtOptions {
    decimalPlaces?: number;
    showZeros?: boolean;
    def?: number;
    thouSep?: string;
    decimalSep?: string;
}
export declare const $famt: (amount: any, options?: fAmtOptions) => string;
export declare const $zFill: (v: any, precision?: number) => string;
export declare const toDecimal: (value: any, decimals?: number) => {
    $numberDecimal: string;
};
export interface arrayToObjectOptions {
    key?: string;
    select?: string | string[];
    fullObject?: boolean;
    asObject?: boolean;
    format?: (item: any) => any;
}
export declare const arrayToObject: (items: any[], options?: arrayToObjectOptions) => any;
export declare const dateRangeToPeriod: (dateFrom: any, dateTo: any, period: any) => number;
export declare const sortArray: (arr: any[], fields: any, desc?: boolean) => any[];
export interface computeFunctionOptions {
    params?: any[];
    data?: any;
    defaultValue?: any;
}
export declare const computeFunctionalCodeAsync: (code: string, options: computeFunctionOptions) => Promise<any>;
export declare const computeFunctionalCode: (code: string, options: computeFunctionOptions) => any;
export declare const $moment: typeof moment;
