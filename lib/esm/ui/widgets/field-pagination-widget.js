import { VBtn } from 'vuetify/components';
const PAGINATION_BUTTON_VARIANTS = new Set(['flat', 'text', 'outlined', 'plain', 'elevated', 'tonal']);
function paginationButtonVariant(field) {
    const variant = field.$params.paginationVariant || field.$params.variant;
    return variant && PAGINATION_BUTTON_VARIANTS.has(variant) ? variant : 'outlined';
}
export function buildPaginationWidget(field) {
    const h = field.$h;
    const params = field.$params;
    const value = field.$pagination;
    const pageCount = Math.max(1, Math.ceil(value.total / value.limit));
    const skip = (value.page - 1) * value.limit;
    const start = value.total > 0 ? skip + 1 : 0;
    const end = value.total > 0 ? Math.min(skip + value.limit, value.total) : 0;
    // Pagination is navigation, so display-mode forms remain pageable. Consumers
    // can still disable it explicitly or while a remote page is loading.
    const disabled = params.readonly === true || params.paginationLoading === true;
    const color = params.color || 'primary';
    const activeVariant = paginationButtonVariant(field);
    const pageSizeControls = params.showItemsPerPage === false
        ? []
        : [
            h('div', { class: ['vef-pagination__page-sizes'] }, [
                h('span', { class: ['vef-pagination__label'] }, field.$text(params.label, field.$uiText('ve.field.pagination.itemsPerPage', 'Items per page'))),
                ...field.$paginationItemsPerPageOptions.map((limit) => h(VBtn, {
                    key: limit,
                    size: 'small',
                    rounded: 'pill',
                    color,
                    variant: limit === value.limit ? activeVariant : 'text',
                    disabled,
                    'aria-label': field.$uiText('ve.field.pagination.setItemsPerPage', 'Show {limit} items per page', { limit }),
                    'aria-pressed': limit === value.limit,
                    onClick: () => {
                        void field.setPagination({ limit }, { notify: true, origin: 'user', reason: 'limit' });
                    },
                }, () => String(limit))),
            ]),
        ];
    const statusControls = h('div', {
        class: ['vef-pagination__status'],
        'aria-live': 'polite',
        'aria-atomic': 'true',
    }, [
        ...(params.showItemRange === false ? [] : [
            h('span', { class: ['vef-pagination__range'] }, value.total > 0
                ? field.$uiText('ve.field.pagination.range', 'Showing {start}-{end} of {total}', { start, end, total: value.total })
                : field.$uiText('ve.field.pagination.zeroItems', 'Showing 0 items')),
        ]),
        h(VBtn, {
            size: 'small',
            color,
            variant: activeVariant,
            disabled: disabled || value.page <= 1,
            'aria-label': field.$uiText('ve.field.pagination.previousPage', 'Previous page'),
            onClick: () => {
                void field.setPagination({ page: value.page - 1 }, { notify: true, origin: 'user', reason: 'page' });
            },
        }, () => field.$uiText('ve.common.prev', 'Previous')),
        ...(params.showPageInfo === false ? [] : [
            h('span', { class: ['vef-pagination__page-info'] }, field.$uiText('ve.field.pagination.pageOf', 'Page {page} of {total}', { page: value.page, total: pageCount })),
        ]),
        h(VBtn, {
            size: 'small',
            color,
            variant: activeVariant,
            disabled: disabled || value.page >= pageCount,
            'aria-label': field.$uiText('ve.field.pagination.nextPage', 'Next page'),
            onClick: () => {
                void field.setPagination({ page: value.page + 1 }, { notify: true, origin: 'user', reason: 'page' });
            },
        }, () => field.$uiText('ve.common.next', 'Next')),
    ]);
    return h('div', {
        class: ['vef-pagination', ...(params.class || [])],
        style: params.style || {},
        role: 'navigation',
        'aria-label': field.$uiText('ve.field.pagination.navigation', 'Pagination'),
        'aria-busy': params.paginationLoading === true,
    }, [
        ...pageSizeControls,
        statusControls,
    ]);
}
