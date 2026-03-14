import { VCard, VCol, VRow } from 'vuetify/components';
import { VDataTable, VDataTableFooter, VDataTableServer, VDataTableVirtual } from 'vuetify/components';
import nestedProperty from 'nested-property';
import { Master } from '../../master';
export function buildTableWidget(field) {
    const h = field.$h;
    if (!field.tableLoaded.value) {
        field.loadTableInformation();
    }
    else {
        const formatted = field.formatTableItems(field.tableItems.value || []);
        field.setCurrentCollectionItems(formatted);
        if (field.params.value.hasFooter)
            field.setCurrentCollectionFooter(field.buildTableFooter(formatted));
    }
    return buildStandardTableLayout(field, h(VDataTable, {
        headers: field.tableHeaders.value || [],
        items: field.getCurrentCollectionItems(),
        class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
        showSelect: !field.$readonly,
        itemValue: Master.resolveItemValueField(field.getCurrentCollectionItems(), field.params.value.idField),
        itemsPerPage: field.params.value.itemsPerPage || 10,
        returnObject: true,
        fixedHeader: true,
        fixedFooter: true,
        hover: true,
        height: field.params.value.height || 400,
        modelValue: field.modelValue.value,
        'onUpdate:modelValue': (value) => { field.modelValue.value = value; },
        'onClick:row': (_, { item }) => field.handleOn('click:row', item),
    }, buildTableSlots(field)));
}
export function buildServerTableWidget(field) {
    const h = field.$h;
    if (!field.tableLoaded.value) {
        field.loadTableInformation({ itemsPerPage: field.tableItemsPerPage.value, page: field.tablePage.value });
    }
    else if (field.params.value.hasFooter) {
        field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
    }
    return buildStandardTableLayout(field, h(VDataTableServer, {
        headers: field.tableHeaders.value || [],
        items: field.tableItems.value,
        class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
        showSelect: !field.$readonly,
        itemValue: Master.resolveItemValueField(field.getCurrentCollectionItems(), field.params.value.idField),
        returnObject: true,
        fixedHeader: true,
        fixedFooter: true,
        density: 'compact',
        height: field.params.value.height || 400,
        page: field.tablePage.value,
        itemsLength: field.tableTotalItems.value,
        itemsPerPage: field.tableItemsPerPage.value,
        hover: true,
        modelValue: field.modelValue.value,
        'onUpdate:options': (options) => {
            field.loadTableInformation(options);
            field.handleOn('changed:options', options);
        },
        'onUpdate:modelValue': (value) => { field.modelValue.value = value; },
        'onClick:row': (_, { item }) => field.handleOn('click:row', item),
    }, buildTableSlots(field)));
}
export function buildViewTableWidget(field) {
    const h = field.$h;
    if (!field.tableLoaded.value) {
        field.loadTableInformation();
    }
    else if (field.params.value.hasFooter) {
        field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
    }
    return buildStandardTableLayout(field, h(VDataTableVirtual, {
        headers: field.tableHeaders.value || [],
        items: field.tableItems.value,
        class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
        showSelect: !field.$readonly,
        itemValue: Master.resolveItemValueField(field.getCurrentCollectionItems(), field.params.value.idField),
        itemsPerPage: field.params.value.itemsPerPage || 10,
        returnObject: true,
        fixedHeader: true,
        fixedFooter: true,
        hover: true,
        height: field.params.value.height || 400,
        modelValue: field.modelValue.value,
        'onUpdate:modelValue': (value) => { field.modelValue.value = value; },
        'onClick:row': (_, { item }) => field.handleOn('click:row', item),
    }, buildTableSlots(field)));
}
export function buildReportTableWidget(field) {
    var _a;
    const h = field.$h;
    if (!field.tableLoaded.value) {
        field.loadTableInformation();
    }
    else if (field.params.value.hasFooter) {
        field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
    }
    const maxWidth = typeof field.maxWidth.value === 'number' ? field.maxWidth.value - 5 : field.maxWidth.value;
    const minWidth = field.maxWidth.value
        ? `${Math.max((typeof field.maxWidth.value === 'number' ? field.maxWidth.value - 5 : Number(field.maxWidth.value)) || 0, ((_a = field.params.value) === null || _a === void 0 ? void 0 : _a.minWidth) || 900)}px`
        : undefined;
    return h(VRow, {}, () => [
        buildLabel(field),
        h(VCol, { cols: 12 }, () => h(VCard, {
            class: ['overflow-auto', 'mx-auto', 'pa-0'],
            maxWidth,
            elevation: 0,
        }, () => h('table', {
            class: ['reporttable'],
            style: minWidth ? { minWidth } : {},
        }, [
            h('thead', {}, makeReportTableHeader(field)),
            h('tbody', { style: { maxHeight: field.params.value.height ? `${field.params.value.height}px` : '400px' } }, makeReportTableBody(field)),
            ...(field.params.value.hasFooter ? [h('tfoot', {}, makeReportTableFooter(field, field.getCurrentCollectionFooter()))] : []),
        ]))),
    ]);
}
function buildStandardTableLayout(field, table) {
    const h = field.$h;
    return h(VRow, {}, () => [
        buildLabel(field),
        h(VCol, { cols: 12 }, () => h(VCard, {
            class: ['overflow-auto', 'mx-auto', 'pa-0'],
            maxWidth: field.maxWidth.value,
            elevation: 0,
        }, () => table)),
    ]);
}
function buildLabel(field) {
    const h = field.$h;
    return h(VCol, { cols: 12 }, () => h('div', {}, field.params.value.label));
}
function buildTableSlots(field) {
    const h = field.$h;
    return Object.assign(Object.assign({}, field.makeHTMLColumns(field.tableHeaders.value)), (field.params.value.hasFooter ? {
        bottom: (options) => [
            h(VDataTable, {
                headers: options.headers[0],
                density: 'compact',
                hideNoData: true,
                items: field.getCurrentCollectionFooter(),
            }, {
                top: () => h('hr'),
                headers: () => h('div'),
                bottom: () => h('hr', { class: ['mb-4'] }),
                'item.data-table-select': () => h('div'),
            }),
            h(VDataTableFooter, {}),
        ],
    } : {}));
}
function getColspan(header) {
    var _a;
    let span = 1;
    if (((_a = header.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        span = 0;
        for (const child of header.children) {
            span += getColspan(child);
        }
    }
    return span;
}
function calculateHeaderRows(headers) {
    let cnt = 0;
    let children = [];
    let currentHeaders = headers || [];
    const headerRows = [];
    while (currentHeaders.length > 0) {
        children = [];
        cnt += 1;
        for (const item of currentHeaders) {
            if (item.children && item.children.length > 0) {
                children = children.concat(item.children || []);
                item.colspan = getColspan(item);
            }
            else {
                item.colspan = 1;
            }
        }
        headerRows.push(currentHeaders);
        currentHeaders = children;
    }
    return { headerRows, rowCount: cnt };
}
function getItemHeaders(headers) {
    var _a;
    let items = [];
    for (const item of headers) {
        if (((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            items = items.concat(getItemHeaders(item.children));
        }
        else {
            items.push(item);
        }
    }
    return items;
}
function makeReportTableHeader(field) {
    var _a;
    const h = field.$h;
    const headers = field.tableHeaders.value || [];
    const { headerRows, rowCount } = calculateHeaderRows(headers);
    const rows = [];
    for (let i = 0; i < headerRows.length; i++) {
        const columns = [];
        const heads = headerRows[i];
        for (const col of heads) {
            columns.push(h('th', Object.assign(Object.assign({}, (col.attributes || {})), { colspan: col.colspan || 1, rowspan: ((_a = col.children) === null || _a === void 0 ? void 0 : _a.length) > 0 ? 1 : rowCount - i, onClick: () => field.handleOn('click:header', col) }), col.title || ''));
        }
        rows.push(h('tr', {}, columns));
    }
    return rows;
}
function makeReportTableBody(field) {
    const h = field.$h;
    const headers = getItemHeaders(field.tableHeaders.value || []);
    const items = field.tableItems.value || [];
    const rows = [];
    for (const item of items) {
        const columns = [];
        for (const head of headers) {
            columns.push(h('td', Object.assign(Object.assign({}, (head.itemAttributes || {})), { onClick: () => field.handleOn('click:item', { header: head, item }) }), head.key ? (head.format ? head.format(nestedProperty.get(item, head.key), item, field) : nestedProperty.get(item, head.key)) : ''));
        }
        rows.push(h('tr', {
            onClick: () => field.handleOn('click:row', item),
        }, columns));
    }
    return rows;
}
function makeReportTableFooter(field, items) {
    const h = field.$h;
    const headers = getItemHeaders(field.tableHeaders.value || []);
    const rows = [];
    for (const item of items) {
        const columns = [];
        for (const head of headers) {
            columns.push(h('th', Object.assign(Object.assign({}, (head.footerAttributes || {})), { onClick: () => field.handleOn('click:footer-item', { header: head, item }) }), head.key ? (head.footerFormat ? head.footerFormat(nestedProperty.get(item, head.key), item, field) : nestedProperty.get(item, head.key)) : ''));
        }
        rows.push(h('tr', {
            onClick: () => field.handleOn('click:footer-row', item),
        }, columns));
    }
    return rows;
}
