export type FieldPaginationChangeReason = 'page' | 'limit' | 'programmatic';
export interface FieldPaginationValue {
    page: number;
    limit: number;
    total: number;
}
export interface FieldPaginationEvent extends FieldPaginationValue {
    skip: number;
    pageCount: number;
    start: number;
    end: number;
    reason: FieldPaginationChangeReason;
    previousValue: FieldPaginationValue;
}
export interface FieldPaginationDefaults {
    page?: number;
    limit?: number;
    total?: number;
}
export declare function normalizeFieldPaginationValue(value: any, defaults?: FieldPaginationDefaults): FieldPaginationValue;
export declare function updateFieldPaginationValue(previousValue: FieldPaginationValue, value: Partial<FieldPaginationValue>, reason: FieldPaginationChangeReason): FieldPaginationValue;
export declare function createFieldPaginationEvent(value: FieldPaginationValue, previousValue: FieldPaginationValue, reason: FieldPaginationChangeReason): FieldPaginationEvent;
