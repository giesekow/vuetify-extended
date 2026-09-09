import { Ref, VNode } from "vue";
import { VCard, VCol, VRow } from 'vuetify/components';
import { VDataTable, VDataTableFooter, VDataTableServer, VDataTableVirtual } from 'vuetify/components';
import nestedProperty from 'nested-property';
import { Master } from '../../master';
import { resolveUITableHeaders, type UITableHeader } from '../table-header';

export interface TableWidgetContext {
  $h: any;
  $text: (value: any, fallback?: string) => string;
  $readonly: boolean;
  params: Ref<any>;
  modelValue: Ref<any>;
  maxWidth: Ref<any>;
  tableHeaders: Ref<UITableHeader[]>;
  tableItems: Ref<any[]>;
  tableLoaded: Ref<boolean>;
  tableItemsPerPage: Ref<any>;
  tableTotalItems: Ref<any>;
  tablePage: Ref<any>;
  getCurrentCollectionItems: () => any[];
  setCurrentCollectionItems: (items: any[]) => void;
  getCurrentCollectionFooter: () => any[];
  setCurrentCollectionFooter: (items: any[]) => void;
  loadTableInformation: (options?: any) => void | Promise<void>;
  formatTableItems: (items: any[]) => any[];
  buildTableFooter: (items: any[]) => any[];
  makeHTMLColumns: (headers: UITableHeader[]) => any;
  handleOn: (event: string, data?: any) => void;
}

export function buildTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;
  const headers = resolvedTableHeaders(field);

  if (!field.tableLoaded.value) {
    field.loadTableInformation();
  } else {
    const formatted = field.formatTableItems(field.tableItems.value || []);
    field.setCurrentCollectionItems(formatted);
    if (field.params.value.hasFooter) field.setCurrentCollectionFooter(field.buildTableFooter(formatted));
  }

  return buildStandardTableLayout(field, h(VDataTable, {
    headers: headers as any,
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
    'onUpdate:modelValue': (value: any) => { field.modelValue.value = value; },
    'onClick:row': (_: any, { item }: any) => field.handleOn('click:row', item),
  }, buildTableSlots(field, headers)));
}

export function buildServerTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;
  const headers = resolvedTableHeaders(field);

  if (!field.tableLoaded.value) {
    field.loadTableInformation({ itemsPerPage: field.tableItemsPerPage.value, page: field.tablePage.value });
  } else if (field.params.value.hasFooter) {
    field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
  }

  return buildStandardTableLayout(field, h(VDataTableServer, {
    headers: headers as any,
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
    'onUpdate:options': (options: any) => {
      field.loadTableInformation(options);
      field.handleOn('changed:options', options);
    },
    'onUpdate:modelValue': (value: any) => { field.modelValue.value = value; },
    'onClick:row': (_: any, { item }: any) => field.handleOn('click:row', item),
  }, buildTableSlots(field, headers)));
}

export function buildViewTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;
  const headers = resolvedTableHeaders(field);

  if (!field.tableLoaded.value) {
    field.loadTableInformation();
  } else if (field.params.value.hasFooter) {
    field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
  }

  return buildStandardTableLayout(field, h(VDataTableVirtual, {
    headers: headers as any,
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
    'onUpdate:modelValue': (value: any) => { field.modelValue.value = value; },
    'onClick:row': (_: any, { item }: any) => field.handleOn('click:row', item),
  }, buildTableSlots(field, headers)));
}

export function buildReportTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;
  const headers = field.tableHeaders.value || [];

  if (!field.tableLoaded.value) {
    field.loadTableInformation();
  } else if (field.params.value.hasFooter) {
    field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
  }

  const maxWidth = typeof field.maxWidth.value === 'number' ? field.maxWidth.value - 5 : field.maxWidth.value;
  const minWidth = field.params.value?.minWidth
    ? (typeof field.params.value.minWidth === 'number' ? `${field.params.value.minWidth}px` : field.params.value.minWidth)
    : undefined;

  return h(VRow, {}, () => [
    buildLabel(field),
    h(
      VCol,
      { cols: 12 },
      () => h(
        VCard,
        {
          class: ['overflow-auto', 'mx-auto', 'pa-0'],
          maxWidth,
          elevation: 0,
        },
        () => h(
          'table',
          {
            class: ['reporttable'],
            style: minWidth ? { minWidth } : {},
          },
          [
            h('thead', {}, makeReportTableHeader(field, headers)),
            h('tbody', { style: { maxHeight: field.params.value.height ? `${field.params.value.height}px` : '400px' } }, makeReportTableBody(field, headers)),
            ...(field.params.value.hasFooter ? [h('tfoot', {}, makeReportTableFooter(field, field.getCurrentCollectionFooter(), headers))] : []),
          ]
        )
      )
    ),
  ]);
}

function buildStandardTableLayout(field: TableWidgetContext, table: VNode) {
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

function buildLabel(field: TableWidgetContext) {
  const h = field.$h;
  return h(VCol, { cols: 12 }, () => h('div', {}, field.$text(field.params.value.label)));
}

function resolvedTableHeaders(field: TableWidgetContext) {
  return resolveUITableHeaders(field.tableHeaders.value, (value) => field.$text(value));
}

function buildTableSlots(field: TableWidgetContext, headers: UITableHeader[]) {
  const h = field.$h;
  return {
    ...field.makeHTMLColumns(headers),
    ...(field.params.value.hasFooter ? {
      bottom: (options: any) => [
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
    } : {}),
  };
}

function getColspan(header: UITableHeader): number {
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

interface ReportTableHeaderCell {
  header: UITableHeader;
  colspan: number;
}

function calculateHeaderRows(headers: UITableHeader[]) {
  let cnt = 0;
  let children: UITableHeader[] = [];
  let currentHeaders: UITableHeader[] = headers || [];
  const headerRows: ReportTableHeaderCell[][] = [];

  while (currentHeaders.length > 0) {
    children = [];
    cnt += 1;
    const row: ReportTableHeaderCell[] = [];
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

function getItemHeaders(headers: UITableHeader[]) {
  let items: UITableHeader[] = [];
  for (const item of headers) {
    const children = item.children || [];
    if (children.length > 0) {
      items = items.concat(getItemHeaders(children));
    } else {
      items.push(item);
    }
  }
  return items;
}

function makeReportTableHeader(field: TableWidgetContext, headers: UITableHeader[]) {
  const h = field.$h;
  const { headerRows, rowCount } = calculateHeaderRows(headers);
  const rows: any[] = [];

  for (let i = 0; i < headerRows.length; i++) {
    const columns: any[] = [];
    const cells = headerRows[i];
    for (const cell of cells) {
      const col = cell.header;
      columns.push(h('th', {
        ...(col.attributes || {}),
        colspan: cell.colspan,
        rowspan: (col.children || []).length > 0 ? 1 : rowCount - i,
        onClick: () => field.handleOn('click:header', col),
      }, field.$text(col.title)));
    }
    rows.push(h('tr', {}, columns));
  }

  return rows;
}

function makeReportTableBody(field: TableWidgetContext, tableHeaders: UITableHeader[]) {
  const h = field.$h;
  const headers = getItemHeaders(tableHeaders);
  const items = field.tableItems.value || [];
  const rows: any[] = [];

  for (const item of items) {
    const columns: any[] = [];
    for (const head of headers) {
      columns.push(h('td', {
        ...(head.itemAttributes || {}),
        onClick: () => field.handleOn('click:item', { header: head, item }),
      }, head.key ? (head.format ? head.format(nestedProperty.get(item, head.key), item, field) : nestedProperty.get(item, head.key)) : ''));
    }

    rows.push(h('tr', {
      onClick: () => field.handleOn('click:row', item),
    }, columns));
  }

  return rows;
}

function makeReportTableFooter(field: TableWidgetContext, items: any[], tableHeaders: UITableHeader[]) {
  const h = field.$h;
  const headers = getItemHeaders(tableHeaders);
  const rows: any[] = [];

  for (const item of items) {
    const columns: any[] = [];
    for (const head of headers) {
      columns.push(h('th', {
        ...(head.footerAttributes || {}),
        onClick: () => field.handleOn('click:footer-item', { header: head, item }),
      }, head.key ? (head.footerFormat ? head.footerFormat(nestedProperty.get(item, head.key), item, field) : nestedProperty.get(item, head.key)) : ''));
    }

    rows.push(h('tr', {
      onClick: () => field.handleOn('click:footer-row', item),
    }, columns));
  }

  return rows;
}
