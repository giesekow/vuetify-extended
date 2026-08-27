export function normalizeFieldPaginationValue(value, defaults = {}) {
    var _a, _b, _c, _d, _e, _f;
    const fallbackLimit = Math.max(1, Math.trunc(Number(defaults.limit || 10)) || 10);
    const limit = Math.max(1, Math.trunc(Number((_b = (_a = value === null || value === void 0 ? void 0 : value.limit) !== null && _a !== void 0 ? _a : value === null || value === void 0 ? void 0 : value.itemsPerPage) !== null && _b !== void 0 ? _b : fallbackLimit)) || fallbackLimit);
    const total = Math.max(0, Math.trunc(Number((_d = (_c = value === null || value === void 0 ? void 0 : value.total) !== null && _c !== void 0 ? _c : defaults.total) !== null && _d !== void 0 ? _d : 0)) || 0);
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const requestedPage = Math.max(1, Math.trunc(Number((_f = (_e = value === null || value === void 0 ? void 0 : value.page) !== null && _e !== void 0 ? _e : defaults.page) !== null && _f !== void 0 ? _f : 1)) || 1);
    return {
        page: Math.min(requestedPage, pageCount),
        limit,
        total,
    };
}
export function updateFieldPaginationValue(previousValue, value, reason) {
    const merged = Object.assign(Object.assign({}, previousValue), value);
    if (reason === 'limit') {
        merged.page = 1;
    }
    return normalizeFieldPaginationValue(merged, previousValue);
}
export function createFieldPaginationEvent(value, previousValue, reason) {
    const pageCount = Math.max(1, Math.ceil(value.total / value.limit));
    const skip = (value.page - 1) * value.limit;
    return Object.assign(Object.assign({}, value), { skip,
        pageCount, start: value.total > 0 ? skip + 1 : 0, end: value.total > 0 ? Math.min(skip + value.limit, value.total) : 0, reason,
        previousValue });
}
