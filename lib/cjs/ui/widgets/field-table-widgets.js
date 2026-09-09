"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReportTableWidget = exports.buildViewTableWidget = exports.buildServerTableWidget = exports.buildTableWidget = void 0;
const components_1 = require("vuetify/components");
const components_2 = require("vuetify/components");
const nested_property_1 = __importDefault(require("nested-property"));
const master_1 = require("../../master");
const table_header_1 = require("../table-header");
function buildTableWidget(field) {
    const h = field.$h;
    const headers = resolvedTableHeaders(field);
    if (!field.tableLoaded.value) {
        field.loadTableInformation();
    }
    else {
        const formatted = field.formatTableItems(field.tableItems.value || []);
        field.setCurrentCollectionItems(formatted);
        if (field.params.value.hasFooter)
            field.setCurrentCollectionFooter(field.buildTableFooter(formatted));
    }
    return buildStandardTableLayout(field, h(components_2.VDataTable, {
        headers: headers,
        items: field.getCurrentCollectionItems(),
        class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
        showSelect: !field.$readonly,
        itemValue: master_1.Master.resolveItemValueField(field.getCurrentCollectionItems(), field.params.value.idField),
        itemsPerPage: field.params.value.itemsPerPage || 10,
        returnObject: true,
        fixedHeader: true,
        fixedFooter: true,
        hover: true,
        height: field.params.value.height || 400,
        modelValue: field.modelValue.value,
        'onUpdate:modelValue': (value) => { field.modelValue.value = value; },
        'onClick:row': (_, { item }) => field.handleOn('click:row', item),
    }, buildTableSlots(field, headers)));
}
exports.buildTableWidget = buildTableWidget;
function buildServerTableWidget(field) {
    const h = field.$h;
    const headers = resolvedTableHeaders(field);
    if (!field.tableLoaded.value) {
        field.loadTableInformation({ itemsPerPage: field.tableItemsPerPage.value, page: field.tablePage.value });
    }
    else if (field.params.value.hasFooter) {
        field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
    }
    return buildStandardTableLayout(field, h(components_2.VDataTableServer, {
        headers: headers,
        items: field.tableItems.value,
        class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
        showSelect: !field.$readonly,
        itemValue: master_1.Master.resolveItemValueField(field.getCurrentCollectionItems(), field.params.value.idField),
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
    }, buildTableSlots(field, headers)));
}
exports.buildServerTableWidget = buildServerTableWidget;
function buildViewTableWidget(field) {
    const h = field.$h;
    const headers = resolvedTableHeaders(field);
    if (!field.tableLoaded.value) {
        field.loadTableInformation();
    }
    else if (field.params.value.hasFooter) {
        field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
    }
    return buildStandardTableLayout(field, h(components_2.VDataTableVirtual, {
        headers: headers,
        items: field.tableItems.value,
        class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
        showSelect: !field.$readonly,
        itemValue: master_1.Master.resolveItemValueField(field.getCurrentCollectionItems(), field.params.value.idField),
        itemsPerPage: field.params.value.itemsPerPage || 10,
        returnObject: true,
        fixedHeader: true,
        fixedFooter: true,
        hover: true,
        height: field.params.value.height || 400,
        modelValue: field.modelValue.value,
        'onUpdate:modelValue': (value) => { field.modelValue.value = value; },
        'onClick:row': (_, { item }) => field.handleOn('click:row', item),
    }, buildTableSlots(field, headers)));
}
exports.buildViewTableWidget = buildViewTableWidget;
function buildReportTableWidget(field) {
    var _a;
    const h = field.$h;
    const headers = field.tableHeaders.value || [];
    if (!field.tableLoaded.value) {
        field.loadTableInformation();
    }
    else if (field.params.value.hasFooter) {
        field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
    }
    const maxWidth = typeof field.maxWidth.value === 'number' ? field.maxWidth.value - 5 : field.maxWidth.value;
    const minWidth = ((_a = field.params.value) === null || _a === void 0 ? void 0 : _a.minWidth)
        ? (typeof field.params.value.minWidth === 'number' ? `${field.params.value.minWidth}px` : field.params.value.minWidth)
        : undefined;
    return h(components_1.VRow, {}, () => [
        buildLabel(field),
        h(components_1.VCol, { cols: 12 }, () => h(components_1.VCard, {
            class: ['overflow-auto', 'mx-auto', 'pa-0'],
            maxWidth,
            elevation: 0,
        }, () => h('table', {
            class: ['reporttable'],
            style: minWidth ? { minWidth } : {},
        }, [
            h('thead', {}, makeReportTableHeader(field, headers)),
            h('tbody', { style: { maxHeight: field.params.value.height ? `${field.params.value.height}px` : '400px' } }, makeReportTableBody(field, headers)),
            ...(field.params.value.hasFooter ? [h('tfoot', {}, makeReportTableFooter(field, field.getCurrentCollectionFooter(), headers))] : []),
        ]))),
    ]);
}
exports.buildReportTableWidget = buildReportTableWidget;
function buildStandardTableLayout(field, table) {
    const h = field.$h;
    return h(components_1.VRow, {}, () => [
        buildLabel(field),
        h(components_1.VCol, { cols: 12 }, () => h(components_1.VCard, {
            class: ['overflow-auto', 'mx-auto', 'pa-0'],
            maxWidth: field.maxWidth.value,
            elevation: 0,
        }, () => table)),
    ]);
}
function buildLabel(field) {
    const h = field.$h;
    return h(components_1.VCol, { cols: 12 }, () => h('div', {}, field.$text(field.params.value.label)));
}
function resolvedTableHeaders(field) {
    return (0, table_header_1.resolveUITableHeaders)(field.tableHeaders.value, (value) => field.$text(value));
}
function buildTableSlots(field, headers) {
    const h = field.$h;
    return Object.assign(Object.assign({}, field.makeHTMLColumns(headers)), (field.params.value.hasFooter ? {
        bottom: (options) => [
            h(components_2.VDataTable, {
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
            h(components_2.VDataTableFooter, {}),
        ],
    } : {}));
}
function getColspan(header) {
    let span = 1;
    const children = header.children || [];
    if (children.length > 0) {
        span = 0;
        for (const child of children) {
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
        const row = [];
        for (const item of currentHeaders) {
            if (item.children && item.children.length > 0) {
                children = children.concat(item.children || []);
            }
            row.push({ header: item, colspan: getColspan(item) });
        }
        headerRows.push(row);
        currentHeaders = children;
    }
    return { headerRows, rowCount: cnt };
}
function getItemHeaders(headers) {
    let items = [];
    for (const item of headers) {
        const children = item.children || [];
        if (children.length > 0) {
            items = items.concat(getItemHeaders(children));
        }
        else {
            items.push(item);
        }
    }
    return items;
}
function makeReportTableHeader(field, headers) {
    const h = field.$h;
    const { headerRows, rowCount } = calculateHeaderRows(headers);
    const rows = [];
    for (let i = 0; i < headerRows.length; i++) {
        const columns = [];
        const cells = headerRows[i];
        for (const cell of cells) {
            const col = cell.header;
            columns.push(h('th', Object.assign(Object.assign({}, (col.attributes || {})), { colspan: cell.colspan, rowspan: (col.children || []).length > 0 ? 1 : rowCount - i, onClick: () => field.handleOn('click:header', col) }), field.$text(col.title)));
        }
        rows.push(h('tr', {}, columns));
    }
    return rows;
}
function makeReportTableBody(field, tableHeaders) {
    const h = field.$h;
    const headers = getItemHeaders(tableHeaders);
    const items = field.tableItems.value || [];
    const rows = [];
    for (const item of items) {
        const columns = [];
        for (const head of headers) {
            columns.push(h('td', Object.assign(Object.assign({}, (head.itemAttributes || {})), { onClick: () => field.handleOn('click:item', { header: head, item }) }), head.key ? (head.format ? head.format(nested_property_1.default.get(item, head.key), item, field) : nested_property_1.default.get(item, head.key)) : ''));
        }
        rows.push(h('tr', {
            onClick: () => field.handleOn('click:row', item),
        }, columns));
    }
    return rows;
}
function makeReportTableFooter(field, items, tableHeaders) {
    const h = field.$h;
    const headers = getItemHeaders(tableHeaders);
    const rows = [];
    for (const item of items) {
        const columns = [];
        for (const head of headers) {
            columns.push(h('th', Object.assign(Object.assign({}, (head.footerAttributes || {})), { onClick: () => field.handleOn('click:footer-item', { header: head, item }) }), head.key ? (head.footerFormat ? head.footerFormat(nested_property_1.default.get(item, head.key), item, field) : nested_property_1.default.get(item, head.key)) : ''));
        }
        rows.push(h('tr', {
            onClick: () => field.handleOn('click:footer-row', item),
        }, columns));
    }
    return rows;
}
