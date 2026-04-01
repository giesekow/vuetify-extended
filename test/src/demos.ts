import { h } from 'vue';
import { VAvatar, VChip, VIcon } from 'vuetify/components';
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
  ShellIconAction,
  UserArea,
  MailboxView,
  Dashboard,
  DashboardMetricWidget,
  DashboardTableWidget,
  DashboardListWidget,
  DashboardProgressWidget,
  DashboardChartWidget,
  DashboardTrendWidget,
  DashboardTimelineWidget,
  DashboardActionListWidget,
  DashboardAlertWidget,
  DashboardEmptyStateWidget,
  DashboardStatGridWidget,
  DashboardMapWidget,
  DashboardCalendarWidget,
  DashboardTabsWidget,
  AccessDeniedScreen,
  SplashScreen,
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

const DEMO_MAP_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
const DEMO_POINT_LOCATION = { lat: 48.366512, lng: 10.894446 };
const DEMO_MULTI_POINT_LOCATIONS = [
  { lat: 48.366512, lng: 10.894446 },
  { lat: 48.371481, lng: 10.898222 },
  { lat: 48.361924, lng: 10.887601 },
];
const DEMO_LINE_LOCATION = {
  type: 'LineString',
  coordinates: [
    [10.8842, 48.3651],
    [10.8931, 48.3682],
    [10.9048, 48.3634],
  ],
};
const DEMO_CIRCLE_LOCATION = {
  center: { lat: 48.366512, lng: 10.894446 },
  radius: 850,
};
const DEMO_RECTANGLE_LOCATION = {
  north: 48.3720,
  south: 48.3616,
  east: 10.9038,
  west: 10.8852,
};
const DEMO_HEATMAP_LOCATION = [
  { location: { lat: 48.366512, lng: 10.894446 }, weight: 4 },
  { location: { lat: 48.368812, lng: 10.898122 }, weight: 7 },
  { location: { lat: 48.364942, lng: 10.889212 }, weight: 5 },
  { location: { lat: 48.371124, lng: 10.901931 }, weight: 6 },
  { location: { lat: 48.360921, lng: 10.886742 }, weight: 3 },
];
const DEMO_CLUSTER_LOCATIONS = [
  { lat: 48.366512, lng: 10.894446 },
  { lat: 48.366842, lng: 10.894912 },
  { lat: 48.367141, lng: 10.895104 },
  { lat: 48.367412, lng: 10.895422 },
  { lat: 48.367731, lng: 10.895731 },
  { lat: 48.368021, lng: 10.896045 },
  { lat: 48.361924, lng: 10.887601 },
  { lat: 48.362114, lng: 10.887923 },
  { lat: 48.362344, lng: 10.888212 },
  { lat: 48.371481, lng: 10.898222 },
];
const DEMO_GEOJSON_LOCATION = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Warehouse' },
      geometry: { type: 'Point', coordinates: [10.894446, 48.366512] },
    },
    {
      type: 'Feature',
      properties: { name: 'Route' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [10.8892, 48.3648],
          [10.8944, 48.3665],
          [10.9011, 48.3681],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'Coverage Area' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [10.8875, 48.3702],
          [10.9028, 48.3702],
          [10.9028, 48.3609],
          [10.8875, 48.3609],
          [10.8875, 48.3702],
        ]],
      },
    },
  ],
};
const DEMO_POLYGON_LOCATION = {
  type: 'Polygon',
  coordinates: [[
    [10.8842, 48.3701],
    [10.9048, 48.3701],
    [10.9048, 48.3598],
    [10.8842, 48.3598],
    [10.8842, 48.3701],
  ]],
};

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

function buildDashboardMetricCard(
  title: string,
  value: number,
  icon: string,
  color: string,
  formatValue?: (value: number) => string,
  delayMs: number = 180,
) {
  return new DashboardMetricWidget(
    {
      title,
      icon,
      iconColor: color,
      cols: 12,
      sm: 6,
      lg: 3,
      height: 118,
      bodyStyle: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    },
    {
      value: async () => {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return value;
      },
      formatValue: (_widget, currentValue) => {
        const numeric = typeof currentValue === 'number' ? currentValue : value;
        return formatValue ? formatValue(numeric) : numeric.toLocaleString();
      },
    },
  );
}

function buildDashboardDemo() {
  const orders = [
    { name: 'G Pro X Superlight', amount: '$149', vendor: 'Logitech', status: 'Completed', rating: '(5.0)' },
    { name: 'DeathAdder V3', amount: '$79', vendor: 'Razer', status: 'Pending', rating: '(4.5)' },
    { name: 'Pulsefire Haste 2', amount: '$299', vendor: 'HyperX', status: 'Completed', rating: '(4.8)' },
    { name: 'Viper V2 Pro', amount: '$29', vendor: 'Razer', status: 'Completed', rating: '(4.2)' },
    { name: 'MX Master 3S', amount: '$49', vendor: 'Logitech', status: 'Cancelled', rating: '(4.0)' },
  ];

  const transactions = [
    { initials: 'JL', label: 'John Leider', time: '21 Mar 8:00PM', amount: '+$36.11', color: '#1f4f2b' },
    { initials: '$', label: 'ATM withdrawal', time: '21 Mar 6:00PM', amount: '-$20.00', color: '#4f3210' },
    { initials: 'JD', label: 'Jane Doe', time: '21 Mar 4:00PM', amount: '+$45.00', color: '#1f4f2b' },
    { initials: 'A', label: 'Amazon', time: '21 Mar 10:00AM', amount: '-$99.99', color: '#4f3210' },
    { initials: 'W', label: 'Water Bill', time: '16 Mar 9:00AM', amount: '-$25.00', color: '#123b5a' },
    { initials: 'E', label: 'Electricity Bill', time: '14 Mar 8:00AM', amount: '-$45.00', color: '#47215a' },
  ];

  const summary = [
    { initials: 'R', label: 'Revenue', value: '$47,230', amount: 0.82 },
    { initials: 'S', label: 'Sales', value: '$14,345', amount: 0.62 },
    { initials: 'C', label: 'Cost', value: '$12,345', amount: 0.41 },
    { initials: 'P', label: 'Profit', value: '$34,567', amount: 0.2 },
  ];

  const revenueSeries = [
    { label: 'Jan', value: 9200 },
    { label: 'Feb', value: 10450 },
    { label: 'Mar', value: 11320 },
    { label: 'Apr', value: 12640 },
    { label: 'May', value: 14110 },
    { label: 'Jun', value: 15340 },
  ];

  const categoryMix = [
    { label: 'Gaming', value: 47, valueLabel: '47%' },
    { label: 'Office', value: 28, valueLabel: '28%' },
    { label: 'Audio', value: 15, valueLabel: '15%' },
    { label: 'Other', value: 10, valueLabel: '10%' },
  ];

  const activityTimeline = [
    { title: 'Warehouse sync completed', subtitle: 'Inventory levels were refreshed across all regions.', time: '09:20', icon: 'mdi-warehouse', color: '#3b82f6' },
    { title: 'New enterprise order approved', subtitle: 'HyperX procurement request cleared finance review.', time: '10:05', icon: 'mdi-check-decagram-outline', color: '#10b981' },
    { title: 'Low stock alert raised', subtitle: 'MX Master 3S inventory dropped below the reorder threshold.', time: '11:40', icon: 'mdi-alert-circle-outline', color: '#f59e0b' },
    { title: 'Shipment delayed', subtitle: 'Carrier updated the expected delivery window for batch 1042.', time: '13:15', icon: 'mdi-truck-delivery-outline', color: '#ef4444' },
  ];

  const actionItems = [
    { title: 'Create campaign', subtitle: 'Launch a targeted promo for high-intent segments.', icon: 'mdi-bullhorn-outline', avatarColor: '#1e3a8a', actionText: 'Launch', actionColor: 'primary' },
    { title: 'Review returns queue', subtitle: '12 returns are waiting for approval.', icon: 'mdi-package-variant-closed-remove', avatarColor: '#7c2d12', chipText: '12 pending', chipColor: 'warning', actionText: 'Review', actionColor: 'warning' },
    { title: 'Invite teammate', subtitle: 'Add another operator to the commerce workspace.', icon: 'mdi-account-plus-outline', avatarColor: '#14532d', actionText: 'Invite', actionColor: 'success' },
  ];

  const growthSparkline = [38, 44, 41, 53, 57, 62, 69, 74];

  const alertItems = [
    { severity: 'warning' as const, title: 'Inventory threshold reached', message: 'MX Master 3S stock is below the target threshold in EU West.', time: '5 min ago', chipText: 'Restock soon' },
    { severity: 'error' as const, title: 'Carrier delay detected', message: 'Two orders are trending beyond the promised delivery window.', time: '18 min ago', chipText: 'Needs review' },
    { severity: 'info' as const, title: 'Pricing sync completed', message: 'Marketplace pricing finished syncing for 42 products.', time: '42 min ago', chipText: 'Completed' },
  ];

  const statGridItems = [
    { label: 'AOV', value: '$128', caption: 'Average order value', icon: 'mdi-cash-multiple', color: '#3b82f6' },
    { label: 'Refund rate', value: '1.4%', caption: 'Down 0.2% this week', icon: 'mdi-undo-variant', color: '#10b981' },
    { label: 'Conversion', value: '4.8%', caption: 'Storefront conversion', icon: 'mdi-chart-line', color: '#f59e0b' },
    { label: 'Open tickets', value: 12, caption: 'Awaiting support follow-up', icon: 'mdi-lifebuoy', color: '#ef4444' },
  ];

  const mapData = {
    markers: [
      { lat: 48.366512, lng: 10.894446, label: 'Warehouse', color: '#3b82f6' },
      { lat: 48.371481, lng: 10.898222, label: 'Hub', color: '#10b981' },
      { lat: 48.361924, lng: 10.887601, label: 'Store', color: '#f59e0b' },
    ],
    line: [
      { lat: 48.361924, lng: 10.887601 },
      { lat: 48.366512, lng: 10.894446 },
      { lat: 48.371481, lng: 10.898222 },
    ],
    polygon: [
      { lat: 48.373, lng: 10.885 },
      { lat: 48.373, lng: 10.904 },
      { lat: 48.359, lng: 10.904 },
      { lat: 48.359, lng: 10.885 },
    ],
  };

  const calendarItems = [
    { date: new Date(2026, 2, 4), title: 'Retail campaign', color: '#3b82f6' },
    { date: new Date(2026, 2, 9), title: 'Vendor review', color: '#10b981' },
    { date: new Date(2026, 2, 9), title: 'Ops sync', color: '#8b5cf6' },
    { date: new Date(2026, 2, 14), title: 'Promo launch', color: '#f59e0b' },
    { date: new Date(2026, 2, 21), title: 'Quarterly snapshot', color: '#ef4444' },
  ];

  const statusColor = (status: string) => status === 'Completed' ? 'success' : (status === 'Pending' ? 'warning' : 'error');

  return new Dashboard(
    {
      title: 'Commerce Dashboard',
      subtitle: 'A first-pass dashboard screen built on UIBase widgets.',
      maxWidth: 1400,
      dense: true,
      theme: 'dark',
      backgroundColor: '#1f2937',
      backgroundGradient: 'linear-gradient(180deg, rgba(31,41,55,0.96) 0%, rgba(30,41,59,0.9) 100%)',
      backgroundImage: 'radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 28%), radial-gradient(circle at bottom left, rgba(16,185,129,0.12), transparent 24%)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      containerStyle: { paddingTop: '36px', paddingBottom: '28px', borderRadius: '20px' },
    },
    {
      menuItems: (dashboard) => [
        new MenuItem(
          {
            text: 'Refresh Widgets',
            subText: 'Reload all dashboard data',
            icon: 'mdi-refresh',
            action: 'function',
          },
          {
            callback: async () => {
              Dialogs.$showProgress({});
              try {
                await dashboard.refresh();
                Dialogs.$success('Dashboard refreshed from menu.');
              } finally {
                Dialogs.$hideProgress();
              }
            },
          },
        ),
        new MenuItem(
          {
            text: 'Open Dashboard Tools',
            subText: 'Launch a reusable Menu screen',
            icon: 'mdi-view-grid-outline',
            action: 'menu',
          },
          {
            menu: async () => new Menu(
              { title: 'Dashboard Tools' },
              {
                children: () => [
                  new MenuItem(
                    {
                      text: 'Show Success Message',
                      subText: 'Simple function-style menu action',
                      icon: 'mdi-check-circle-outline',
                      action: 'function',
                    },
                    {
                      callback: async () => {
                        Dialogs.$success('Dashboard tools menu clicked.');
                      },
                    },
                  ),
                  new MenuItem(
                    {
                      text: 'Open Splash Screen',
                      subText: 'Show another UIBase screen from the menu',
                      icon: 'mdi-image-filter-center-focus-strong-outline',
                      action: 'function',
                    },
                    {
                      callback: async () => {
                        AppManager.showUI(new SplashScreen({
                          title: 'Preparing Workspace',
                          subtitle: 'Loading dashboard utilities...',
                          loadingText: 'Almost ready',
                          backgroundColor: '#0f172a',
                          backgroundGradient: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.9) 100%)',
                        }));
                      },
                    },
                  ),
                ],
              },
            ),
          },
        ),
        new MenuItem(
          {
            text: 'About This Menu',
            subText: 'This dropdown uses MenuItem actions directly',
            icon: 'mdi-information-outline',
            action: 'function',
          },
          {
            callback: async () => {
              Dialogs.$success('Dashboard header actions are powered by MenuItem definitions.');
            },
          },
        ),
      ],
      topChildren: () => [
        buildDashboardMetricCard('Total subscribers', 23412, 'mdi-account-group-outline', '#1e88e5', (value) => value.toLocaleString(), 120),
        buildDashboardMetricCard('Total revenue', 14301, 'mdi-star-outline', '#43a047', (value) => `$${value.toLocaleString()}`, 220),
        buildDashboardMetricCard('Total orders', 402, 'mdi-cart-outline', '#fb8c00', (value) => value.toLocaleString(), 320),
        buildDashboardMetricCard('Total products', 76, 'mdi-shape-outline', '#e53935', (value) => value.toLocaleString(), 420),
      ],
      children: () => [
        new DashboardTableWidget(
          {
            title: 'Recent Orders',
            cols: 12,
            lg: 8,
            height: 430,
            headers: [
              { key: 'name', title: 'Name' },
              { key: 'amount', title: 'Amount' },
              { key: 'vendor', title: 'Vendor' },
              { key: 'status', title: 'Status' },
              { key: 'rating', title: 'Rating', align: 'end' },
            ],
            items: orders,
            showSearch: true,
            searchPlaceholder: 'Search',
            pagination: true,
            pageSize: 3,
          },
          {
            onRowClick: async (_widget, row) => {
              Dialogs.$success(`Selected ${row.name}`);
            },
            cell: (_widget, row, column) => {
              if (column.key === 'name') {
                return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
                  h(VAvatar, { size: 32, color: 'grey-darken-2' }, () => row.name.charAt(0)),
                  h('span', row.name),
                ]);
              }

              if (column.key === 'status') {
                return h(VChip, { size: 'x-small', color: statusColor(row.status), variant: 'outlined' }, () => row.status);
              }

              if (column.key === 'rating') {
                return h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' } }, [
                  h('span', row.rating),
                  h(VIcon, { icon: 'mdi-star', color: 'warning', size: 16 }),
                ]);
              }
            },
          },
        ),
        new DashboardChartWidget(
          {
            title: 'Revenue Trend',
            subtitle: 'Monthly revenue performance',
            cols: 12,
            lg: 4,
            height: 430,
            chartType: 'line',
            items: revenueSeries,
            chartHeight: 230,
          },
          {
            onItemClicked: async (_widget, item) => {
              Dialogs.$success(`Focused ${item.label} revenue`);
            },
          },
        ),
      ],
      bottomChildren: () => [
        new DashboardListWidget({
          title: 'Transactions',
          cols: 12,
          lg: 4,
          separator: true,
          height: 360,
          items: transactions.map((item, index) => ({
            key: index,
            avatarText: item.initials,
            avatarColor: item.color,
            title: item.label,
            subtitle: item.time,
            value: item.amount,
          })),
        }),
        new DashboardProgressWidget({
          title: 'Summary',
          cols: 12,
          lg: 4,
          height: 360,
          items: summary.map((item, index) => ({
            key: index,
            avatarText: item.initials,
            avatarColor: 'primary',
            label: item.label,
            value: item.value,
            amount: item.amount,
            color: 'primary',
            bgColor: 'grey-darken-1',
          })),
        }),
        new DashboardTimelineWidget(
          {
            title: 'Activity Timeline',
            cols: 12,
            lg: 4,
            height: 360,
            items: activityTimeline,
          },
          {
            onItemClicked: async (_widget, item) => {
              Dialogs.$success(item.title);
            },
          },
        ),
        new DashboardTrendWidget(
          {
            title: 'Growth Snapshot',
            subtitle: 'Customer growth over the last 8 weeks',
            cols: 12,
            lg: 4,
            height: 320,
            trend: 'up',
            caption: 'Monthly active customers are trending upward.',
            sparklineValues: growthSparkline,
            icon: 'mdi-trending-up',
            iconColor: '#10b981',
          },
          {
            value: async () => 18.4,
            delta: async () => '+4.6% MoM',
            formatValue: (_widget, value) => `${Number(value || 0).toFixed(1)}%`,
            onClicked: async () => {
              Dialogs.$success('Growth snapshot opened.');
            },
          },
        ),
        new DashboardActionListWidget(
          {
            title: 'Quick Actions',
            cols: 12,
            lg: 4,
            height: 320,
            items: actionItems,
          },
          {
            onItemClicked: async (_widget, item) => {
              Dialogs.$success(`${item.title} clicked`);
            },
          },
        ),
        new DashboardChartWidget(
          {
            title: 'Category Mix',
            subtitle: 'Revenue share by segment',
            cols: 12,
            lg: 4,
            height: 320,
            chartType: 'donut',
            items: categoryMix,
            chartHeight: 220,
          },
          {
            onItemClicked: async (_widget, item) => {
              Dialogs.$success(`${item.label}: ${item.valueLabel || item.value}`);
            },
          },
        ),
        new DashboardAlertWidget(
          {
            title: 'Alerts',
            cols: 12,
            lg: 4,
            height: 360,
            items: alertItems,
          },
          {
            onItemClicked: async (_widget, item) => {
              Dialogs.$success(item.title);
            },
          },
        ),
        new DashboardCalendarWidget(
          {
            title: 'Calendar',
            cols: 12,
            lg: 4,
            height: 360,
            year: 2026,
            month: 3,
            items: calendarItems,
          },
          {
            onDateClicked: async (_widget, date, items) => {
              Dialogs.$success(`${date.toDateString()}${items.length ? ` (${items.length} items)` : ''}`);
            },
          },
        ),
        new DashboardMapWidget(
          {
            title: 'Coverage Map',
            subtitle: 'Warehouse, route, and service footprint',
            cols: 12,
            lg: 4,
            height: 360,
            data: mapData,
            mapHeight: 250,
          },
          {
            onMarkerClicked: async (_widget, marker) => {
              Dialogs.$success(marker.label || 'Marker clicked');
            },
          },
        ),
        new DashboardStatGridWidget(
          {
            title: 'KPI Grid',
            cols: 12,
            lg: 4,
            height: 320,
            columns: 2,
            items: statGridItems,
          },
          {
            onItemClicked: async (_widget, item) => {
              Dialogs.$success(`${item.label}: ${item.value}`);
            },
          },
        ),
        new DashboardTabsWidget(
          {
            title: 'Workspace Tabs',
            cols: 12,
            lg: 4,
            height: 320,
            tabs: [
              {
                label: 'Regions',
                badge: 3,
                children: () => [
                  h('div', { style: { display: 'grid', gap: '10px' } }, [
                    h(VChip, { color: 'primary', variant: 'tonal' }, () => 'EU West'),
                    h(VChip, { color: 'success', variant: 'tonal' }, () => 'US Central'),
                    h(VChip, { color: 'warning', variant: 'tonal' }, () => 'APAC South'),
                  ]),
                ],
              },
              {
                label: 'Ops',
                children: () => [
                  h('div', { style: { display: 'grid', gap: '8px' } }, [
                    h('div', { style: { fontWeight: 600 } }, 'Open work items'),
                    h('div', { class: ['text-body-2'], style: { opacity: 0.74 } }, '12 tickets awaiting assignment'),
                    h('div', { class: ['text-body-2'], style: { opacity: 0.74 } }, '4 inbound deliveries expected today'),
                  ]),
                ],
              },
              {
                label: 'Notes',
                children: () => [
                  h('div', { class: ['text-body-2'], style: { opacity: 0.78, lineHeight: 1.6 } }, 'Dashboard tabs can swap between small contextual panels without leaving the page.'),
                ],
              },
            ],
          },
          {
            onTabChanged: async (_widget, tab) => {
              Dialogs.$success(`Switched to ${tab.label}`);
            },
          },
        ),
        new DashboardEmptyStateWidget(
          {
            title: 'Onboarding',
            cols: 12,
            lg: 4,
            height: 320,
            titleText: 'No campaigns connected',
            message: 'Connect your first campaign source to start measuring attribution, spend, and conversion data in this dashboard.',
            icon: 'mdi-rocket-launch-outline',
            toneColor: '#8b5cf6',
            buttonText: 'Connect Source',
          },
          {
            onClicked: async () => {
              Dialogs.$success('Connect source clicked.');
            },
          },
        ),
      ],
    },
  );
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
      //width: 1120,
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

function buildMapsForm() {
  return new Form(
    {
      title: 'Maps',
      width: 1120,
      defaultButtonPosition: 'both',
    },
    {
      children: () => [
        new Part(
          { cols: 12, dense: true },
          {
            children: () => [
              buildInfoLabel('Map coverage: editable point/multi-point/line/circle/rectangle/polygon widgets plus display-only heatmap, clustered markers, and mixed GeoJSON examples.'),
              new Field({
                label: 'Office Location',
                storage: 'officeLocation',
                type: 'map',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_POINT_LOCATION,
                hint: DEMO_MAP_API_KEY ? 'Point map with reverse-geocoded text below the map.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the map demos.',
              }),
              new Field({
                label: 'Delivery Stops',
                storage: 'deliveryStops',
                type: 'map',
                multiple: true,
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_MULTI_POINT_LOCATIONS,
                hint: DEMO_MAP_API_KEY ? 'Multi-marker example. Click to add more stops, drag to adjust, and right-click a marker to remove it.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the multi-marker demo.',
              }),
              new Field({
                label: 'Courier Route',
                storage: 'courierRoute',
                type: 'map-line',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_LINE_LOCATION,
                hint: DEMO_MAP_API_KEY ? 'GeoJSON line example. Click to add points and drag vertices to edit the route.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the line demo.',
              }),
              new Field({
                label: 'Pickup Radius',
                storage: 'pickupRadius',
                type: 'map-circle',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_CIRCLE_LOCATION,
                hint: DEMO_MAP_API_KEY ? 'Circle example. Drag or resize the circle to adjust the radius.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the circle demo.',
              }),
              new Field({
                label: 'Selection Bounds',
                storage: 'selectionBounds',
                type: 'map-rectangle',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_RECTANGLE_LOCATION,
                hint: DEMO_MAP_API_KEY ? 'Rectangle example. Drag or resize the bounds to edit the area.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the rectangle demo.',
              }),
              new Field({
                label: 'Service Area',
                storage: 'serviceArea',
                type: 'map-polygon',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_POLYGON_LOCATION,
                hint: DEMO_MAP_API_KEY ? 'GeoJSON polygon example. Click to add points and drag vertices to edit.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the polygon demo.',
              }),
              new Field({
                label: 'Demand Heatmap',
                storage: 'demandHeatmap',
                type: 'map-heatmap',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_HEATMAP_LOCATION,
                hint: DEMO_MAP_API_KEY ? 'Display-only heatmap example using weighted points.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the heatmap demo.',
              }),
              new Field({
                label: 'Depot Clusters',
                storage: 'depotClusters',
                type: 'map-cluster',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_CLUSTER_LOCATIONS,
                hint: DEMO_MAP_API_KEY ? 'Display-only clustered marker example for dense point sets.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the cluster demo.',
              }),
              new Field({
                label: 'Mixed GeoJSON',
                storage: 'mixedGeoJson',
                type: 'map-geojson',
                cols: 4,
                height: 260,
                mapApiKey: DEMO_MAP_API_KEY,
                mapZoom: 13,
                default: DEMO_GEOJSON_LOCATION,
                hint: DEMO_MAP_API_KEY ? 'Display-only mixed GeoJSON example with point, line, and polygon features.' : 'Set VITE_GOOGLE_MAPS_API_KEY in the test app to enable the GeoJSON demo.',
              }),
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
      forms: 4,
      mode: params?.mode || 'edit',
      horizontalAlign: 'center',
      verticalAlign: 'center',
      //fluid: true,
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
          return buildMapsForm();
        }
        if (index === 3) {
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
      // width: 1100,
      objectType: 'people',
      idField: '_id',
      multiple: true,
      mode: 'edit',
      queryFields: ['name', 'email', 'role'],
      canExport: false,
      canPrint: false,
      sideButtonPosition: 'left',
      fluid: true
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
      lg: 6,
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
            shortcut: 'CTRL+F',
            shortcutDisplay: 'compact'
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
            text: 'Show Access Denied Screen',
            subText: 'Full-screen access denied utility screen rendered through the stack.',
            icon: 'mdi-shield-lock-outline',
            color: 'error',
          },
          {
            callback: async () => {
              AppManager.showUI(new AccessDeniedScreen(
                {
                  title: 'Workspace Access Required',
                  subtitle: 'Authorization Needed',
                  message: 'Your account is authenticated, but this tenant is not available for the current role. Please request access from the platform administrator.',
                  actionText: 'Return Home',
                  backgroundGradient: 'radial-gradient(circle at top, rgba(248,113,113,0.20), transparent 44%), linear-gradient(160deg, #111827 0%, #1f2937 52%, #334155 100%)',
                },
                {
                  action: async () => {
                    AppManager.back();
                  },
                },
              ));
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Show Splash Screen',
            subText: 'Full-screen splash/loading utility screen with branding.',
            icon: 'mdi-rocket-launch-outline',
            color: 'info',
          },
          {
            callback: async () => {
              AppManager.showUI(new SplashScreen({
                title: 'Vuetify Extended',
                subtitle: 'Demo Workspace',
                message: 'Loading demo services, shell widgets, mailbox data, and keyboard bindings.',
                loadingText: 'Preparing the workspace…',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg',
                backgroundGradient: 'radial-gradient(circle at top, rgba(16,185,129,0.18), transparent 40%), linear-gradient(180deg, #f8fbff 0%, #e8f3ef 100%)',
                progressColor: 'success',
              }));
            },
          },
        ),
        new MenuItem(
          {
            action: 'function',
            text: 'Show Dashboard',
            subText: 'First-pass dashboard screen with reusable dashboard widgets.',
            icon: 'mdi-view-dashboard-outline',
            color: 'secondary',
          },
          {
            callback: async () => {
              AppManager.showUI(buildDashboardDemo());
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
  const instance: any = new MemoryApi(clone(store));
  Api.setInstance(instance);
  return instance;
}

export function createDemoApp() {
  configureDemoMailbox();
  return new AppMain(
    {
      ref: 'demo-app',
      title: 'Vuetify Extended Demo Workspace',
      mobileTitle: 'VE Demo',
      mobileLogo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 stop-color=%22%230f3d63%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%231d6fa5%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x=%224%22 y=%224%22 width=%2256%22 height=%2256%22 rx=%2214%22 fill=%22url(%23g)%22/%3E%3Cpath d=%22M18 20h8l6 18 6-18h8L35 46h-6L18 20Z%22 fill=%22white%22/%3E%3C/svg%3E',
      showHeader: true,
      showFooter: true,
      headerLayout: 'auto',
      footerLayout: 'auto',
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
        new AppTitleBlock({
          title: app.$params.title || 'Vuetify Extended',
          subtitle: 'Reusable shell widgets in the AppMain header',
          overline: 'Workspace',
          icon: 'mdi-view-dashboard-outline',
          color: '#0f3d63',
          mobileLocation: 'drawer',
        }),
      ],
      headerCenter: () => [
        new EnvironmentTag({ text: 'Demo', color: 'warning', mobileLocation: 'drawer' }),
        new StatusBadge({ text: 'Shell Active', icon: 'mdi-check-circle-outline', color: 'success', mobileLocation: 'drawer' }),
      ],
      headerEnd: () => [
        new ShellIconAction(
          {
            icon: 'mdi-help-circle-outline',
            color: 'secondary',
            title: 'Show shell help',
            mobileLocation: 'drawer',
          },
          {
            onClicked: () => Dialogs.$info('This header action is rendered with the reusable ShellIconAction widget.'),
          },
        ),
        new MailboxBell({ color: 'primary', badgeColor: 'error', title: 'Open Team Mailbox', viewWidth: 980, mobileLocation: 'header' }),
        new UserArea(
          {
            name: 'Administrator User',
            subtitle: 'UI Engineer',
            email: 'administrator@prequizer.com',
            accountId: 'C6L2-0Z2D-XW49-AB11',
            avatarColor: 'primary',
            avatarSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
            avatarAlt: 'Administrator profile picture',
            mobileLocation: 'header',
          },
          {
            buttons: async () => [
              new Button(
                { text: 'Mailbox', icon: 'mdi-email-outline', variant: 'text', block: true },
                { onClicked: () => { AppManager.showUI(new MailboxView({ title: Mailbox.$title, width: 980 })); } },
              ),
              new Button(
                { text: 'Profile', icon: 'mdi-cog', variant: 'text', block: true },
                { onClicked: () => { Notifications.$info('Profile action triggered from UserArea.', { title: 'User Area' }); } },
              ),
              { type: 'separator', label: 'Session' },
              new Button(
                { text: 'Logout', icon: 'mdi-lock-outline', variant: 'text', block: true },
                { onClicked: async () => {
                  const confirmed = await Dialogs.$confirm('Sign out from the demo user area?');
                  if (confirmed) {
                    Notifications.$success('Logout action triggered.', { title: 'User Area' });
                  }
                } },
              ),
            ],
          },
        ),
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
