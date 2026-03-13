import { Ref, VNode } from "vue";
import { VCard, VCol, VRow } from 'vuetify/components';
import { VDataTable, VDataTableFooter, VDataTableServer, VDataTableVirtual } from 'vuetify/components';
import nestedProperty from 'nested-property';

export interface TableWidgetContext {
  $h: any;
  $readonly: boolean;
  params: Ref<any>;
  modelValue: Ref<any>;
  maxWidth: Ref<any>;
  tableHeaders: Ref<any[]>;
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
  makeHTMLColumns: (headers: any[]) => any;
  handleOn: (event: string, data?: any) => void;
}

export function buildTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;

  if (!field.tableLoaded.value) {
    field.loadTableInformation();
  } else {
    const formatted = field.formatTableItems(field.tableItems.value || []);
    field.setCurrentCollectionItems(formatted);
    if (field.params.value.hasFooter) field.setCurrentCollectionFooter(field.buildTableFooter(formatted));
  }

  return buildStandardTableLayout(field, h(VDataTable, {
    headers: field.tableHeaders.value || [],
    items: field.getCurrentCollectionItems(),
    class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
    showSelect: !field.$readonly,
    itemValue: field.params.value.idField || '_id',
    itemsPerPage: field.params.value.itemsPerPage || 10,
    returnObject: true,
    fixedHeader: true,
    fixedFooter: true,
    hover: true,
    height: field.params.value.height || 400,
    modelValue: field.modelValue.value,
    'onUpdate:modelValue': (value: any) => { field.modelValue.value = value; },
    'onClick:row': (_: any, { item }: any) => field.handleOn('click:row', item),
  }, buildTableSlots(field)));
}

export function buildServerTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;

  if (!field.tableLoaded.value) {
    field.loadTableInformation({ itemsPerPage: field.tableItemsPerPage.value, page: field.tablePage.value });
  } else if (field.params.value.hasFooter) {
    field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
  }

  return buildStandardTableLayout(field, h(VDataTableServer, {
    headers: field.tableHeaders.value || [],
    items: field.tableItems.value,
    class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
    showSelect: !field.$readonly,
    itemValue: field.params.value.idField || '_id',
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
  }, buildTableSlots(field)));
}

export function buildViewTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;

  if (!field.tableLoaded.value) {
    field.loadTableInformation();
  } else if (field.params.value.hasFooter) {
    field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
  }

  return buildStandardTableLayout(field, h(VDataTableVirtual, {
    headers: field.tableHeaders.value || [],
    items: field.tableItems.value,
    class: [...(field.params.value.class || []), 'dense-table', ...(field.params.value.bordered ? ['bordered-table'] : [])],
    showSelect: !field.$readonly,
    itemValue: field.params.value.idField || '_id',
    itemsPerPage: field.params.value.itemsPerPage || 10,
    returnObject: true,
    fixedHeader: true,
    fixedFooter: true,
    hover: true,
    height: field.params.value.height || 400,
    modelValue: field.modelValue.value,
    'onUpdate:modelValue': (value: any) => { field.modelValue.value = value; },
    'onClick:row': (_: any, { item }: any) => field.handleOn('click:row', item),
  }, buildTableSlots(field)));
}

export function buildReportTableWidget(field: TableWidgetContext): VNode {
  const h = field.$h;

  if (!field.tableLoaded.value) {
    field.loadTableInformation();
  } else if (field.params.value.hasFooter) {
    field.setCurrentCollectionFooter(field.buildTableFooter(field.tableItems.value));
  }

  const maxWidth = typeof field.maxWidth.value === 'number' ? field.maxWidth.value - 5 : field.maxWidth.value;
  const minWidth = field.maxWidth.value
    ? `${Math.max((typeof field.maxWidth.value === 'number' ? field.maxWidth.value - 5 : Number(field.maxWidth.value)) || 0, field.params.value?.minWidth || 900)}px`
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
            h('thead', {}, makeReportTableHeader(field)),
            h('tbody', { style: { maxHeight: field.params.value.height ? `${field.params.value.height}px` : '400px' } }, makeReportTableBody(field)),
            ...(field.params.value.hasFooter ? [h('tfoot', {}, makeReportTableFooter(field, field.getCurrentCollectionFooter()))] : []),
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
  return h(VCol, { cols: 12 }, () => h('div', {}, field.params.value.label));
}

function buildTableSlots(field: TableWidgetContext) {
  const h = field.$h;
  return {
    ...field.makeHTMLColumns(field.tableHeaders.value),
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

function getColspan(header: any): number {
  let span = 1;
  if (header.children?.length > 0) {
    span = 0;
    for (const child of header.children) {
      span += getColspan(child);
    }
  }
  return span;
}

function calculateHeaderRows(headers: any[]) {
  let cnt = 0;
  let children: any[] = [];
  let currentHeaders: any[] = headers || [];
  const headerRows: any[] = [];

  while (currentHeaders.length > 0) {
    children = [];
    cnt += 1;
    for (const item of currentHeaders) {
      if (item.children && item.children.length > 0) {
        children = children.concat(item.children || []);
        item.colspan = getColspan(item);
      } else {
        item.colspan = 1;
      }
    }
    headerRows.push(currentHeaders);
    currentHeaders = children;
  }

  return { headerRows, rowCount: cnt };
}

function getItemHeaders(headers: any[]) {
  let items: any[] = [];
  for (const item of headers) {
    if (item.children?.length > 0) {
      items = items.concat(getItemHeaders(item.children));
    } else {
      items.push(item);
    }
  }
  return items;
}

function makeReportTableHeader(field: TableWidgetContext) {
  const h = field.$h;
  const headers = field.tableHeaders.value || [];
  const { headerRows, rowCount } = calculateHeaderRows(headers);
  const rows: any[] = [];

  for (let i = 0; i < headerRows.length; i++) {
    const columns: any[] = [];
    const heads = headerRows[i];
    for (const col of heads) {
      columns.push(h('th', {
        ...(col.attributes || {}),
        colspan: col.colspan || 1,
        rowspan: col.children?.length > 0 ? 1 : rowCount - i,
        onClick: () => field.handleOn('click:header', col),
      }, col.title || ''));
    }
    rows.push(h('tr', {}, columns));
  }

  return rows;
}

function makeReportTableBody(field: TableWidgetContext) {
  const h = field.$h;
  const headers = getItemHeaders(field.tableHeaders.value || []);
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

function makeReportTableFooter(field: TableWidgetContext, items: any[]) {
  const h = field.$h;
  const headers = getItemHeaders(field.tableHeaders.value || []);
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
