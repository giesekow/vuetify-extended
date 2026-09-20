export interface NumberDecimalValue {
    $numberDecimal: string;
}
export type ExactDecimalInput = string | NumberDecimalValue;
export type DecimalFormatInput = ExactDecimalInput | number;
export type DecimalExcessDigits = 'round' | 'reject' | 'preserve';
export declare const MAX_DECIMAL_PLACES = 100;
export interface ExactDecimalParts {
    negative: boolean;
    integer: string;
    fraction: string;
    normalized: string;
}
export interface ExactDecimalNormalization {
    value: string;
    valid: boolean;
    empty: boolean;
    exceedsScale: boolean;
    scale: number;
}
export declare function resolveDecimalPlaces(value?: number): number;
export declare function parseExactDecimal(value: any): ExactDecimalParts | undefined;
export declare function normalizeExactDecimal(value: any, decimalPlaces?: number): ExactDecimalNormalization;
export declare function roundExactDecimal(value: any, decimalPlaces?: number): ExactDecimalNormalization;
export declare function compareExactDecimals(left: any, right: any): number | undefined;
