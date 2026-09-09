/** Resolve translatable titles without mutating application-owned header definitions. */
export function resolveUITableHeaders(headers, resolveText) {
    return (headers || []).map((header) => {
        const resolved = Object.assign(Object.assign({}, header), (header.title !== undefined ? { title: resolveText(header.title) } : {}));
        if (Array.isArray(header.children)) {
            resolved.children = resolveUITableHeaders(header.children, resolveText);
        }
        return resolved;
    });
}
