export interface AutocompleteTableAppendResult<T> {
    values: T[];
    added: boolean;
}
export declare function appendUniqueAutocompleteValue<T>(values: T[], candidate: T, equals: (left: T, right: T) => boolean): AutocompleteTableAppendResult<T>;
export declare function removeAutocompleteValuesAtIndexes<T>(values: T[], indexes: Iterable<number>): T[];
