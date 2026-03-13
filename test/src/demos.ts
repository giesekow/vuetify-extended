import {
  Api,
  AppMain,
  AppManager,
  Button,
  Collection,
  DialogForm,
  Dialogs,
  Field,
  Form,
  Menu,
  MenuItem,
  Part,
  Report,
  Selector,
  Trigger,
} from '../../src';
import {
  createSeedStore,
  LINE_ITEM_HEADERS,
  PEOPLE_HEADERS,
  PRIORITY_OPTIONS,
  RICH_TABLE_HEADERS,
  SEARCH_FIELDS,
  SERVER_TABLE_HEADERS,
  SKILL_OPTIONS,
  STATUS_OPTIONS,
} from './demo-data';
import { MemoryApi } from './mock-api';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function money(value: number) {
  return Number(value || 0).toFixed(2);
}

function totalLineItems(items: any[]) {
  return items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
}

async function loadPeople(query?: any) {
  return Api.instance.service('people').findAll({ query: { ...(query || {}), $paginate: false } });
}

async function loadPeoplePage(page: number, itemsPerPage: number, query?: any) {
  return Api.instance.service('people').find({
    query: {
      ...(query || {}),
      $limit: itemsPerPage,
      $skip: Math.max(page - 1, 0) * itemsPerPage,
    },
  });
}

function buildInfoLabel(text: string) {
  return new Field({
    type: 'label',
    label: text,
    cols: 12,
  });
}

function buildLineItemForm() {
  return new Form(
    {
      title: 'Line Item',
      width: 720,
      defaultButtonPosition: 'bottom',
    },
    {
      children: () => [
        new Part(
          { cols: 12, dense: true },
          {
            children: () => [
              new Field({ label: 'Deliverable', storage: 'name', required: true, cols: 6 }),
              new Field({ label: 'Quantity', storage: 'quantity', type: 'integer', cols: 2, required: true }),
              new Field({ label: 'Price', storage: 'price', type: 'float', cols: 2, required: true }),
              new Field({ label: 'Total', storage: 'total', type: 'float', cols: 2, required: true }),
              new Field({ label: 'Note', storage: 'note', type: 'textarea', cols: 12 }),
            ],
          },
        ),
      ],
    },
  );
}

function buildBasicsForm() {
  return new Form(
    {
      title: 'Basics',
      width: 1120,
      defaultButtonPosition: 'both',
      dense: true,
    },
    {
      children: () => [
        new Part(
          { cols: 12, dense: true },
          {
            children: () => [
              buildInfoLabel('Basic input coverage: text, password, select, autocomplete, list select, numeric, date, time, datetime, boolean, textarea, color, and button fields.'),
              new Field({ label: 'Name', storage: 'name', required: true, cols: 6 }),
              new Field({ label: 'Email', storage: 'email', required: true, cols: 6 }),
              new Field({ label: 'Tags', storage: 'tags', multiple: true, cols: 6, hint: 'Text field in combobox mode.' }),
              new Field({ label: 'Password', storage: 'password', type: 'password', cols: 6 }),
              new Field(
                { label: 'Status', storage: 'status', type: 'select', itemTitle: 'name', itemValue: '_id', cols: 4 },
                { selectOptions: () => STATUS_OPTIONS },
              ),
              new Field(
                { label: 'Manager', storage: 'managerId', type: 'autocomplete', itemTitle: 'name', itemValue: '_id', cols: 4 },
                { selectOptions: async () => loadPeople({ $select: ['name', 'role'] }) },
              ),
              new Field(
                { label: 'Priority', storage: 'priority', type: 'listselect', itemTitle: 'name', itemValue: '_id', cols: 4 },
                { selectOptions: () => PRIORITY_OPTIONS },
              ),
              new Field(
                { label: 'Skills', storage: 'skills', type: 'listselect', multiple: true, itemTitle: 'name', itemValue: '_id', cols: 6 },
                { selectOptions: () => SKILL_OPTIONS },
              ),
              new Field({ label: 'Active', storage: 'active', type: 'boolean', cols: 3 }),
              new Field({ label: 'Newsletter', storage: 'newsletter', type: 'boolean', checkbox: true, cols: 3 }),
              new Field({ label: 'Age', storage: 'age', type: 'integer', cols: 3 }),
              new Field({ label: 'Rate', storage: 'hourlyRate', type: 'float', cols: 3 }),
              new Field({ label: 'Joined Date', storage: 'joinedDate', type: 'date', cols: 4 }),
              new Field({ label: 'Meeting Time', storage: 'meetingTime', type: 'time', cols: 4 }),
              new Field({ label: 'Appointment', storage: 'appointment', type: 'datetime', cols: 4 }),
              new Field({ label: 'Bio', storage: 'bio', type: 'textarea', cols: 8 }),
              new Field({ label: 'Favorite Color', storage: 'favoriteColor', type: 'color', cols: 4 }),
              new Field(
                { label: 'Action Field', type: 'button', cols: 12 },
                {
                  button: () =>
                    new Button(
                      { text: 'Show Success Message', color: 'primary', variant: 'elevated' },
                      {
                        onClicked: () => {
                          Dialogs.$success('Button field rendered and handled click correctly.');
                        },
                      },
                    ),
                },
              ),
            ],
          },
        ),
      ],
    },
  );
}

function buildRichWidgetsForm() {
  return new Form(
    {
      title: 'Rich Widgets',
      width: 1120,
      defaultButtonPosition: 'both',
    },
    {
      children: () => [
        new Part(
          { cols: 12, dense: true },
          {
            children: () => [
              buildInfoLabel('Rich widget coverage: HTML, HTML view, code editor, chart, message box, image, and document fields.'),
              new Field({ label: 'Notes HTML', storage: 'notesHtml', type: 'html', height: 260, cols: 12 }),
              new Field({ label: 'HTML Preview', storage: 'welcomeHtml', type: 'htmlview', cols: 12 }),
              new Field({ label: 'Script', storage: 'script', type: 'code', lang: 'javascript', height: 260, cols: 6 }),
              new Field(
                { label: 'Activity Chart', type: 'chart', chartType: 'bar', height: 260, cols: 6 },
                {
                  chartOptions: async () => ({
                    chart: { toolbar: { show: false } },
                    xaxis: { categories: ['Open', 'Review', 'Done'] },
                    colors: ['#146eb4'],
                  }),
                  chartData: async () => [{ name: 'Tasks', data: [6, 3, 8] }],
                },
              ),
              new Field(
                { label: 'Conversation', storage: 'conversation', type: 'messagingbox', cols: 12 },
                {
                  messageFormat: (_field, messages: any[]) =>
                    (messages || []).map((message) => ({
                      ...message,
                      minWidth: '220px',
                      maxWidth: '80%',
                      theme: message.right ? 'light' : undefined,
                    })),
                },
              ),
              new Field({ label: 'Avatar Upload', storage: 'avatar', type: 'image', cols: 6, hint: 'Select an image file to test upload handling.' }),
              new Field({ label: 'Resume Upload', storage: 'resume', type: 'document', cols: 6, hint: 'Select a PDF or document to test file conversion.' }),
            ],
          },
        ),
      ],
    },
  );
}

function buildTablesForm() {
  return new Form(
    {
      title: 'Tables And Collection',
      width: 1180,
      defaultButtonPosition: 'both',
    },
    {
      children: () => [
        new Part(
          { cols: 12, dense: true },
          {
            children: () => [
              buildInfoLabel('Data-heavy coverage: collection editing plus standard, virtual, server, and report table variants.'),
              new Field(
                {
                  label: 'Line Items',
                  storage: 'lineItems',
                  type: 'collection',
                  cols: 12,
                  height: 240,
                  hasFooter: true,
                },
                {
                  headers: () => LINE_ITEM_HEADERS,
                  form: () => buildLineItemForm(),
                  footer: (_field, items) => [
                    {
                      name: 'Total',
                      quantity: '',
                      price: '',
                      total: money(totalLineItems(items)),
                      note: '',
                    },
                  ],
                },
              ),
              new Field(
                {
                  label: 'Table',
                  storage: 'teamSelection',
                  type: 'table',
                  cols: 12,
                  height: 240,
                  hasFooter: true,
                  itemValue: '_id',
                },
                {
                  headers: () => RICH_TABLE_HEADERS,
                  items: async () => {
                    const items = await loadPeople();
                    return items.map((person: any) => ({
                      ...person,
                      email: {
                        html: `<a href="mailto:${person.email}">${person.email}</a>`,
                      },
                    }));
                  },
                  footer: () => [
                    {
                      name: 'Visible rows',
                      role: '',
                      status: '',
                      email: `${createSeedStore().people.length} records`,
                    },
                  ],
                },
              ),
              new Field(
                {
                  label: 'Virtual Table',
                  storage: 'virtualSelection',
                  type: 'viewtable',
                  cols: 12,
                  height: 220,
                },
                {
                  headers: () => PEOPLE_HEADERS,
                  items: async () => loadPeople(),
                },
              ),
              new Field(
                {
                  label: 'Server Table',
                  storage: 'serverSelection',
                  type: 'servertable',
                  cols: 12,
                  height: 220,
                },
                {
                  headers: () => SERVER_TABLE_HEADERS,
                  items: async (_field, options) => {
                    const result: any = await loadPeoplePage(options?.page || 1, options?.itemsPerPage || 2);
                    return {
                      ...result,
                      data: (result.data || []).map((person: any) => ({
                        ...person,
                        skills: (person.skills || []).join(', '),
                      })),
                    };
                  },
                },
              ),
              new Field(
                {
                  label: 'Report Table',
                  storage: 'reportSelection',
                  type: 'reporttable',
                  cols: 12,
                  height: 220,
                },
                {
                  headers: () => PEOPLE_HEADERS,
                  items: async () => loadPeople(),
                },
              ),
            ],
          },
        ),
      ],
    },
  );
}

function buildFullReport(params?: { objectId?: string; mode?: 'create' | 'edit' | 'display'; title?: string }) {
  return new Report(
    {
      title: params?.title || 'Person Workspace',
      objectType: 'people',
      objectId: params?.objectId,
      forms: 3,
      mode: params?.mode || 'edit',
      horizontalAlign: 'center',
      verticalAlign: 'center',
      fluid: true,
      sideButtonPosition: 'right',
    },
    {
      form: async (_props, _context, index) => {
        if (index === 0) {
          return buildBasicsForm();
        }
        if (index === 1) {
          return buildRichWidgetsForm();
        }
        if (index === 2) {
          return buildTablesForm();
        }
        return undefined;
      },
      saved: async () => {
        Dialogs.$success('Report save flow completed against the in-memory API.');
      },
      sideButtons: (_props, _context, report) => [
        new Button(
          { text: 'Summary', variant: 'outlined', color: 'primary', icon: 'mdi-account', shortcut: 'F8' },
          {
            onClicked: () => {
              Dialogs.$success(`Active report step: ${report.$currentForm?.$params.title || report.$params.title || 'Unknown'}`);
            },
          },
        ),
        new Button(
          { text: 'Help', variant: 'text', color: 'secondary', shortcut: 'Shift+F8' },
          {
            onClicked: () => {
              Dialogs.$success('Desktop side actions are enabled for this report.');
            },
          },
        ),
      ],
    },
  );
}

function buildCompactReport() {
  return new Report(
    {
      title: 'Collection Editor',
      objectType: 'people',
      forms: 1,
      mode: 'edit',
      horizontalAlign: 'center',
      verticalAlign: 'center',
    },
    {
      form: async () =>
        new Form(
          {
            title: 'Selected Person',
            width: 900,
          },
          {
            children: () => [
              new Part(
                { cols: 12, dense: true },
                {
                  children: () => [
                    new Field({ label: 'Name', storage: 'name', cols: 6, required: true }),
                    new Field({ label: 'Email', storage: 'email', cols: 6, required: true }),
                    new Field(
                      { label: 'Status', storage: 'status', type: 'select', itemTitle: 'name', itemValue: '_id', cols: 4 },
                      { selectOptions: () => STATUS_OPTIONS },
                    ),
                    new Field({ label: 'Role', storage: 'role', cols: 4 }),
                    new Field({ label: 'Active', storage: 'active', type: 'boolean', cols: 4 }),
                    new Field({ label: 'Bio', storage: 'bio', type: 'textarea', cols: 12 }),
                  ],
                },
              ),
            ],
          },
        ),
    },
  );
}

function buildSelectorDemo() {
  return new Selector(
    {
      title: 'Selector Demo',
      subtitle: 'Uses the memory API through the shared Api facade.',
      width: 720,
      multiple: true,
      returnObject: true,
      textField: 'name',
      objectType: 'people',
      idField: '_id',
    },
    {
      selected: async (items, selector) => {
        const list = Array.isArray(items) ? items : [items];
        Dialogs.$success(`Selector returned ${list.filter(Boolean).length} item(s).`);
      },
      query: async () => ({
        $select: ['name', 'email', 'role', 'status'],
        $sort: { name: 1 },
      }),
    },
  );
}

function buildTriggerDemo() {
  return new Trigger(
    {
      title: 'Trigger Demo',
      subtitle: 'Search, filter, select, remove, and process rows.',
      width: 1100,
      objectType: 'people',
      idField: '_id',
      multiple: true,
      mode: 'edit',
      queryFields: ['name', 'email', 'role'],
      canExport: false,
      canPrint: false,
      sideButtonPosition: 'left',
    },
    {
      headers: async () => PEOPLE_HEADERS,
      searchFields: async () => ({
        fields: SEARCH_FIELDS,
      }),
      topChildren: () => [
        buildInfoLabel('Use the search bar and filter chips, then select rows and press Edit to trigger the selected event.'),
      ],
      format: async (_trigger, items) =>
        items.map((item) => ({
          ...item,
          hourlyRate: `$${money(Number(item.hourlyRate || 0))}`,
        })),
      on: () => ({
        selected: (items: any) => {
          Dialogs.$success(`Trigger selected ${items.length} row(s).`);
        },
      }),
      sideButtons: () => [
        new Button(
          { text: 'Help', variant: 'outlined', color: 'primary', shortcut: 'ALT+CTRL+f3', shortcutDisplay: 'compact' },
          {
            onClicked: () => {
              Dialogs.$success('Desktop side actions are enabled for this trigger.');
            },
          },
        ),
        new Button(
          { text: 'Tips', variant: 'text', color: 'secondary', shortcut: 'SHIFT+F9', shortcutDisplay: 'compact', shortcutShiftIcon: 'mdi-apple-keyboard-shift', },
          {
            onClicked: () => {
              Dialogs.$success('Use search, filters, and row selection before choosing Edit.');
            },
          },
        ),
      ],
    },
  );
}

function buildDialogDemo() {
  return new DialogForm(
    {
      ref: 'demo-dialog',
      closeOnSave: true,
      mode: 'create',
    },
    {
      form: async () =>
        new Form(
          {
            title: 'Dialog Form Demo',
            width: 760,
          },
          {
            children: () => [
              new Part(
                { cols: 12, dense: true },
                {
                  children: () => [
                    buildInfoLabel('This dialog uses a local master, so it is safe for quick component checks.'),
                    new Field({ label: 'Title', storage: 'title', cols: 6, required: true }),
                    new Field({ label: 'Owner', storage: 'owner', cols: 6 }),
                    new Field({ label: 'Summary', storage: 'summary', type: 'textarea', cols: 12 }),
                    new Field({ label: 'High Priority', storage: 'highPriority', type: 'boolean', cols: 4 }),
                    new Field({ label: 'Due Date', storage: 'dueDate', type: 'date', cols: 4 }),
                    new Field({ label: 'Reminder', storage: 'reminderTime', type: 'time', cols: 4 }),
                  ],
                },
              ),
            ],
            afterSaved: async () => {
              Dialogs.$success('Dialog form save completed.');
            },
          },
        ),
    },
  );
}

function buildCollectionDemo() {
  return new Collection(
    {
      objectType: 'people',
      idField: '_id',
      multiple: true,
      mode: 'edit',
    },
    {
      trigger: async () => buildTriggerDemo(),
      selector: async () => buildSelectorDemo(),
      report: async () => buildCompactReport(),
    },
  );
}

function buildNestedMenu() {
  return new Menu(
    {
      title: 'Utilities',
      cols: 12,
      md: 6,
      lg: 4,
    },
    {
      children: async () => [
        new MenuItem(
          {
            action: 'function',
            text: 'Show Success',
            subText: 'Exercises the shared success snackbar.',
            icon: 'mdi-check-circle',
            color: 'success',
          },
          {
            callback: async () => {
              Dialogs.$success('Shared dialog success notification works.');
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Show Warning',
            subText: 'Exercises the shared warning snackbar.',
            icon: 'mdi-alert',
            color: 'warning',
          },
          {
            callback: async () => {
              Dialogs.$warning('This is a warning message from the nested menu.');
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Show Confirm',
            subText: 'Exercises the confirmation dialog flow.',
            icon: 'mdi-help-circle',
            color: 'primary',
          },
          {
            callback: async () => {
              const accepted = await Dialogs.$confirm('Do you want to keep exploring the test app?');
              if (accepted) {
                Dialogs.$success('Confirmation returned true.');
              } else {
                Dialogs.$warning('Confirmation returned false.');
              }
            },
          },
        ),
      ],
    },
  );
}

function buildHomeMenu() {
  return new Menu(
    {
      title: 'vuetify-extended Playground',
      cols: 12,
      width: 380,
    },
    {
      children: async () => [
        new MenuItem(
          {
            action: 'report',
            mode: 'edit',
            text: 'Edit Report Demo',
            subText: 'Full report with multiple forms and many field types.',
            icon: 'mdi-form-select',
            color: 'primary',
            shortcut: 'U'
          },
          {
            report: async () => buildFullReport({ objectId: 'person-1', mode: 'edit', title: 'Person Workspace' }),
          },
        ),
        new MenuItem(
          {
            action: 'report',
            mode: 'create',
            text: 'Create Report Demo',
            subText: 'Exercises create mode and save flow.',
            icon: 'mdi-plus-box',
            color: 'indigo',
          },
          {
            report: async () => buildFullReport({ mode: 'create', title: 'New Person Workspace' }),
          },
        ),
        new MenuItem(
          {
            action: 'report',
            mode: 'display',
            text: 'Display Report Demo',
            subText: 'Read-only path through the same report system.',
            icon: 'mdi-eye',
            color: 'teal',
          },
          {
            report: async () => buildFullReport({ objectId: 'person-2', mode: 'display', title: 'Read Only Workspace' }),
          },
        ),
        new MenuItem(
          {
            action: 'collection',
            mode: 'edit',
            text: 'Collection Workflow',
            subText: 'Trigger -> report flow for batch editing.',
            icon: 'mdi-view-list',
            color: 'deep-orange',
          },
          {
            collection: async () => buildCollectionDemo(),
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Open Selector',
            subText: 'Standalone selector overlay.',
            icon: 'mdi-selection-search',
            color: 'cyan-darken-1',
          },
          {
            callback: async () => {
              AppManager.showSelector(buildSelectorDemo());
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Open Trigger',
            subText: 'Standalone trigger screen.',
            icon: 'mdi-table-search',
            color: 'brown',
          },
          {
            callback: async () => {
              AppManager.showUI(buildTriggerDemo());
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Open Dialog Form',
            subText: 'Tests dialog-based forms.',
            icon: 'mdi-application-brackets',
            color: 'secondary',
          },
          {
            callback: async () => {
              AppManager.showDialog(buildDialogDemo());
            },
          },
        ),
        new MenuItem(
          {
            action: 'menu',
            text: 'Utilities',
            subText: 'Nested menu with shared dialog actions.',
            icon: 'mdi-tools',
            color: 'blue-grey',
          },
          {
            menu: async () => buildNestedMenu(),
          },
        ),
      ],
    },
  );
}

export function installDemoApi() {
  const store = createSeedStore();
  const instance = new MemoryApi(clone(store));
  Api.setInstance(instance);
  return instance;
}

export function createDemoApp() {
  return new AppMain(
    {
      ref: 'demo-app',
    },
    {
      menu: async () => buildHomeMenu(),
      udfs: async () => [],
    },
  );
}
