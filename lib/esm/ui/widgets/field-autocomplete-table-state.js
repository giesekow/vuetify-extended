export function appendUniqueAutocompleteValue(values, candidate, equals) {
    if (values.some((value) => equals(value, candidate))) {
        return { values: [...values], added: false };
    }
    return { values: [...values, candidate], added: true };
}
export function removeAutocompleteValuesAtIndexes(values, indexes) {
    const removedIndexes = new Set(indexes);
    return values.filter((_value, index) => !removedIndexes.has(index));
}
