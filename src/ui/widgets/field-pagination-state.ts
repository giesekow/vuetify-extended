export type FieldPaginationChangeReason = 'page'|'limit'|'programmatic';

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

export function normalizeFieldPaginationValue(value: any, defaults: FieldPaginationDefaults = {}): FieldPaginationValue {
  const fallbackLimit = Math.max(1, Math.trunc(Number(defaults.limit || 10)) || 10);
  const limit = Math.max(1, Math.trunc(Number(value?.limit ?? value?.itemsPerPage ?? fallbackLimit)) || fallbackLimit);
  const total = Math.max(0, Math.trunc(Number(value?.total ?? defaults.total ?? 0)) || 0);
  const pageCount = Math.max(1, Math.ceil(total / limit));
  const requestedPage = Math.max(1, Math.trunc(Number(value?.page ?? defaults.page ?? 1)) || 1);

  return {
    page: Math.min(requestedPage, pageCount),
    limit,
    total,
  };
}

export function updateFieldPaginationValue(
  previousValue: FieldPaginationValue,
  value: Partial<FieldPaginationValue>,
  reason: FieldPaginationChangeReason,
): FieldPaginationValue {
  const merged = { ...previousValue, ...value };
  if (reason === 'limit') {
    merged.page = 1;
  }
  return normalizeFieldPaginationValue(merged, previousValue);
}

export function createFieldPaginationEvent(
  value: FieldPaginationValue,
  previousValue: FieldPaginationValue,
  reason: FieldPaginationChangeReason,
): FieldPaginationEvent {
  const pageCount = Math.max(1, Math.ceil(value.total / value.limit));
  const skip = (value.page - 1) * value.limit;
  return {
    ...value,
    skip,
    pageCount,
    start: value.total > 0 ? skip + 1 : 0,
    end: value.total > 0 ? Math.min(skip + value.limit, value.total) : 0,
    reason,
    previousValue,
  };
}
