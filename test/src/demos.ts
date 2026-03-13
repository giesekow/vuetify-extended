import { h } from 'vue';
import {
  Api,
  AppMain,
  AppManager,
  Button,
  Collection,
  DialogForm,
  Dialogs,
  Notifications,
  Mailbox,
  MailboxBell,
  Field,
  Form,
  Menu,
  MenuItem,
  Part,
  Report,
  Selector,
  Trigger,
  AppTitleBlock,
  EnvironmentTag,
  StatusBadge,
  UserArea,
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

const DEMO_MAILBOX_ITEMS = [
  { id: 'mail-1', title: 'Architecture Review Ready', text: 'The platform architecture review is ready for sign-off.', timestamp: '2026-03-13T08:30:00.000Z', category: 'Review', icon: 'mdi-file-document-check-outline', read: false, meta: { personId: 'person-1' } },
  { id: 'mail-2', title: 'Keyboard UX Follow-up', text: 'Please validate the latest keyboard bindings across reports and triggers.', timestamp: '2026-03-13T07:15:00.000Z', category: 'Task', icon: 'mdi-keyboard-outline', read: false, meta: { personId: 'person-2' } },
  { id: 'mail-3', title: 'Design Sync Notes', text: 'New notes are available from the shell layout review.', timestamp: '2026-03-12T16:45:00.000Z', category: 'Info', icon: 'mdi-note-text-outline', read: true, meta: { personId: 'person-3' } },
  { id: 'mail-4', title: 'Collection Workflow Approved', text: 'The batch edit workflow was approved for the next demo.', timestamp: '2026-03-12T13:00:00.000Z', category: 'Approval', icon: 'mdi-check-decagram-outline', read: false, meta: { personId: 'person-1' } },
  { id: 'mail-5', title: 'Report Styling Reminder', text: 'Align side rail width updates before cutting the next release.', timestamp: '2026-03-11T15:20:00.000Z', category: 'Reminder', icon: 'mdi-palette-outline', read: true, meta: { personId: 'person-2' } },
  { id: 'mail-6', title: 'Notifications Feedback', text: 'Notifications should be a little less transparent by default.', timestamp: '2026-03-11T09:10:00.000Z', category: 'Feedback', icon: 'mdi-bell-badge-outline', read: false },
  { id: 'mail-7', title: 'Mailbox Pagination Test', text: 'Load more should pull older mailbox items cleanly.', timestamp: '2026-03-10T18:40:00.000Z', category: 'QA', icon: 'mdi-page-next-outline', read: true },
  { id: 'mail-8', title: 'Message Viewer Request', text: 'Selecting a mailbox item should open a report in the stack.', timestamp: '2026-03-10T10:05:00.000Z', category: 'Feature', icon: 'mdi-open-in-app', read: false },
];

let demoMailboxItems = clone(DEMO_MAILBOX_ITEMS);

function demoMailboxUnreadCount() {
  return demoMailboxItems.filter((item: any) => !item.read).length;
}

function buildMailboxItemReport(item: any) {
  return new Report(
    {
      title: 'Mailbox Message',
      forms: 1,
      mode: 'display',
      horizontalAlign: 'center',
      verticalAlign: 'start',
      fluid: true,
    },
    {
      form: async () =>
        new Form(
          {
            title: item.title || 'Mailbox Message',
            width: 860,
          },
          {
            children: () => [
              new Part(
                { cols: 12, dense: true },
                {
                  children: () => [
                    buildInfoLabel(item.text || ''),
                    new Field({ type: 'label', label: `Category: ${item.category || 'General'}`, cols: 6 }),
                    new Field({ type: 'label', label: `Received: ${item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown'}`, cols: 6 }),
                    new Field({ type: 'label', label: `Status: ${item.read ? 'Read' : 'Unread'}`, cols: 6 }),
                    new Field({ type: 'label', label: `Reference: ${item.meta?.personId || 'N/A'}`, cols: 6 }),
                  ],
                },
              ),
            ],
          },
        ),
    },
  );
}

function configureDemoMailbox() {
  Mailbox.configure({
    title: 'Team Mailbox',
    pageSize: 4,
    load: async ({ page, pageSize }) => {
      const start = Math.max(page - 1, 0) * pageSize;
      const end = start + pageSize;
      return {
        items: clone(demoMailboxItems.slice(start, end)),
        total: demoMailboxItems.length,
        unreadCount: demoMailboxUnreadCount(),
        hasMore: end < demoMailboxItems.length,
      };
    },
    loadUnreadCount: async () => demoMailboxUnreadCount(),
    markRead: async (item) => {
      const target = demoMailboxItems.find((entry: any) => entry.id === item.id);
      if (target) target.read = true;
    },
    markUnread: async (item) => {
      const target = demoMailboxItems.find((entry: any) => entry.id === item.id);
      if (target) target.read = false;
    },
    remove: async (item) => {
      demoMailboxItems = demoMailboxItems.filter((entry: any) => entry.id !== item.id);
    },
    viewItem: async (item) => buildMailboxItemReport(item),
  }, true);
  Mailbox.setUnread(demoMailboxUnreadCount());
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
          { text: 'Summary', variant: 'outlined', color: 'primary', icon: 'mdi-account', shortcut: 'F8', tooltip: 'Show a quick summary of the currently active report step and context.' },
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
            subText: 'Exercises the shared notification stack.',
            icon: 'mdi-check-circle',
            color: 'success',
          },
          {
            callback: async () => {
              Notifications.$success('Shared notification success works.', { title: 'Success' });
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Show Warning',
            subText: 'Exercises the shared warning notification.',
            icon: 'mdi-alert',
            color: 'warning',
          },
          {
            callback: async () => {
              Notifications.$warning('This is a warning notification from the nested menu.', { title: 'Heads up' });
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Show Action Notification',
            subText: 'Notification with action buttons and no modal.',
            icon: 'mdi-bell-badge-outline',
            color: 'info',
          },
          {
            callback: async () => {
              Notifications.$info('Use the action buttons below to respond inline.', {
                title: 'Action Notification',
                persistent: true,
                actions: [
                  new Button(
                    { text: 'Acknowledge', color: 'primary', variant: 'outlined', tooltip: 'Mark this notification as handled without leaving the current screen.' },
                    { onClicked: () => Notifications.$success('Notification acknowledged.') },
                  ),
                  new Button(
                    { text: 'Dismiss All', color: 'secondary', variant: 'text' },
                    { onClicked: () => Notifications.clear() },
                  ),
                ],
              });
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Push Mailbox Item',
            subText: 'Adds a new mailbox item using the delegated mailbox API.',
            icon: 'mdi-mail-plus-outline',
            color: 'secondary',
          },
          {
            callback: async () => {
              const item = {
                id: `mail-${Date.now()}`,
                title: 'Realtime Mailbox Update',
                text: 'A new mailbox item was pushed directly from the test app.',
                timestamp: new Date().toISOString(),
                category: 'Realtime',
                icon: 'mdi-bell-ring-outline',
                read: false,
              };
              demoMailboxItems = [item, ...demoMailboxItems];
              Mailbox.push(item);
              Mailbox.setUnread(demoMailboxUnreadCount());
              Notifications.$info('A new mailbox item was added.', { title: 'Mailbox Updated' });
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
            action: 'function',
            mode: 'edit',
            text: 'Edit Report Demo',
            subText: 'Full report with multiple forms and many field types.',
            icon: 'mdi-form-select',
            color: 'primary',
            shortcut: 'U',
            shortcutDisplay: 'compact'
          },
          {
            callback: async () => {
              const report = buildFullReport({ objectId: 'person-1', mode: 'edit', title: 'Person Workspace' });
              if (await report.access('edit')) {
                report.$params.mode = 'edit';
                AppManager.showReport(report, {
                  fabIcon: 'mdi-file-document-edit-outline',
                  fabColor: 'secondary',
                  fabLabel: 'Report Tools',
                  fabShortcut: 'CTRL+SHIFT+F9',
                  fabButtons: () => [
                    new Button(
                      { text: 'Save Hint', color: 'secondary', variant: 'elevated', icon: 'mdi-content-save-outline', shortcut: 'F12', shortcutDisplay: 'compact' },
                      { onClicked: () => Dialogs.$success('Use Ctrl+S or the Save button to persist this report.') },
                    ),
                    new Button(
                      { text: 'Review Flow', color: 'primary', variant: 'outlined', icon: 'mdi-map-marker-path', shortcut: 'SHIFT+F12', shortcutDisplay: 'compact' },
                      { onClicked: () => Dialogs.$warning('This report is using screen-specific FAB actions.') },
                    ),
                  ],
                });
              } else {
                Dialogs.$error('access denied!');
              }
            },
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
            shortcut: 'CTRL+ALT+K',
            shortcutDisplay: 'compact'
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
              const trigger = buildTriggerDemo() as any;
              trigger.$screenParams = {
                fabIcon: 'mdi-radar',
                fabColor: 'deep-orange',
                fabLabel: 'Trigger Tools',
                fabShortcut: 'CTRL+ALT+F10',
                fabButtons: () => [
                  new Button(
                    { text: 'Search Help', color: 'deep-orange', variant: 'elevated', icon: 'mdi-magnify-scan', shortcut: 'CTRL+F12', shortcutDisplay: 'compact', tooltip: 'Explain the trigger search flow, including Enter to search and Escape to cancel.' },
                    { onClicked: () => Dialogs.$warning('Use Enter to search and Escape to cancel the trigger.') },
                  ),
                  new Button(
                    { text: 'Selection Tip', color: 'brown', variant: 'outlined', icon: 'mdi-lightbulb-on-outline', shortcut: 'ALT+F12', shortcutDisplay: 'compact' },
                    { onClicked: () => Dialogs.$success('Screen-specific FAB actions are now overriding the global app FAB here.') },
                  ),
                ],
              };
              AppManager.showUI(trigger);
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
  configureDemoMailbox();
  return new AppMain(
    {
      ref: 'demo-app',
      title: 'Vuetify Extended Demo Workspace',
      showHeader: true,
      showFooter: true,
      showFab: true,
      fabIcon: 'mdi-lightning-bolt',
      fabColor: 'primary',
      fabLabel: 'Quick Actions',
      fabShortcut: 'CTRL+SHIFT+F8',
      backgroundColor: '#dfe7ef',
      backgroundGradient: 'linear-gradient(145deg, rgba(255,255,255,0.86) 0%, rgba(219,231,242,0.74) 45%, rgba(199,219,237,0.82) 100%)',
      backgroundImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      backgroundOverlay: 'linear-gradient(180deg, rgba(247,250,252,0.78) 0%, rgba(237,243,248,0.88) 100%)',
    },
    {
      menu: async () => buildHomeMenu(),
      udfs: async () => [],
      fabButtons: () => [
        new Button(
          { text: 'Quick Success', color: 'success', variant: 'elevated', icon: 'mdi-check-circle-outline', shortcut: 'F11', shortcutDisplay: 'compact', tooltip: 'Push a success notification using the global FAB quick-action set.' },
          { onClicked: () => Notifications.$success('Quick action executed successfully.', { title: 'FAB Action' }) },
        ),
        new Button(
          { text: 'Quick Warning', color: 'warning', variant: 'elevated', icon: 'mdi-alert-outline', shortcut: 'SHIFT+F11', shortcutDisplay: 'compact' },
          { onClicked: () => Notifications.$warning('Quick action warning example.', { title: 'FAB Action' }) },
        ),
        new Button(
          { text: 'Quick Confirm', color: 'primary', variant: 'outlined', icon: 'mdi-help-circle-outline', shortcut: 'ALT+F11', shortcutDisplay: 'compact' },
          { onClicked: async () => { await Dialogs.$confirm('Run the quick confirm action?'); } },
        ),
      ],
      headerStart: (app) => [
        h(new AppTitleBlock({
          title: app.$params.title || 'Vuetify Extended',
          subtitle: 'Reusable shell widgets in the AppMain header',
          overline: 'Workspace',
          icon: 'mdi-view-dashboard-outline',
          color: '#0f3d63',
        }).component),
      ],
      headerCenter: () => [
        h(new EnvironmentTag({ text: 'Demo', color: 'warning' }).component),
        h(new StatusBadge({ text: 'Shell Active', icon: 'mdi-check-circle-outline', color: 'success' }).component),
      ],
      headerEnd: () => [
        h(new MailboxBell({ color: 'primary', badgeColor: 'error', title: 'Open Team Mailbox', viewWidth: 980 }).component),
        h(new UserArea({ name: 'Alex Builder', subtitle: 'UI Engineer', avatarColor: 'primary' }).component),
      ],
      footerStart: () => [
        h(new StatusBadge({ text: 'Vuetify Extended Test App', icon: 'mdi-flask-outline', color: 'primary', variant: 'outlined' }).component),
      ],
      footerCenter: () => [
        h(new EnvironmentTag({ text: 'Header + Footer + Background', color: 'info', variant: 'outlined' }).component),
      ],
      footerEnd: () => [
        h(new StatusBadge({ text: 'Workflow Shell', icon: 'mdi-view-grid-plus-outline', color: 'secondary', variant: 'tonal' }).component),
      ],
    },
  );
}
