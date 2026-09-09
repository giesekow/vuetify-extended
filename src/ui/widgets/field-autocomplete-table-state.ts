export interface AutocompleteTableAppendResult<T> {
  values: T[];
  added: boolean;
}

export function appendUniqueAutocompleteValue<T>(
  values: T[],
  candidate: T,
  equals: (left: T, right: T) => boolean,
): AutocompleteTableAppendResult<T> {
  if (values.some((value) => equals(value, candidate))) {
    return { values: [...values], added: false };
  }

  return { values: [...values, candidate], added: true };
}

export function removeAutocompleteValuesAtIndexes<T>(values: T[], indexes: Iterable<number>): T[] {
  const removedIndexes = new Set(indexes);
  return values.filter((_value, index) => !removedIndexes.has(index));
}
