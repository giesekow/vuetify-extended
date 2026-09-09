"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAutocompleteValuesAtIndexes = exports.appendUniqueAutocompleteValue = void 0;
function appendUniqueAutocompleteValue(values, candidate, equals) {
    if (values.some((value) => equals(value, candidate))) {
        return { values: [...values], added: false };
    }
    return { values: [...values, candidate], added: true };
}
exports.appendUniqueAutocompleteValue = appendUniqueAutocompleteValue;
function removeAutocompleteValuesAtIndexes(values, indexes) {
    const removedIndexes = new Set(indexes);
    return values.filter((_value, index) => !removedIndexes.has(index));
}
exports.removeAutocompleteValuesAtIndexes = removeAutocompleteValuesAtIndexes;
