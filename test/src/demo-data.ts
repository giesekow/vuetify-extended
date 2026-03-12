export interface DemoPerson {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  managerId: string | null;
  tags: string[];
  priority: string;
  skills: string[];
  active: boolean;
  newsletter: boolean;
  age: number;
  hourlyRate: number;
  joinedDate: string;
  meetingTime: string;
  appointment: string;
  bio: string;
  favoriteColor: string;
  notesHtml: string;
  welcomeHtml: string;
  script: string;
  conversation: Array<{ user: string; message: string; right?: boolean; color?: string; theme?: string }>;
  lineItems: Array<{ _id: string; name: string; quantity: number; price: number; total: number; note?: string }>;
  avatar?: string;
  resume?: string;
  teamSelection: any[];
  virtualSelection: any[];
  serverSelection: any[];
  reportSelection: any[];
}

export const STATUS_OPTIONS = [
  { _id: 'active', name: 'Active' },
  { _id: 'paused', name: 'Paused' },
  { _id: 'on-leave', name: 'On Leave' },
];

export const PRIORITY_OPTIONS = [
  { _id: 'high', name: 'High' },
  { _id: 'medium', name: 'Medium' },
  { _id: 'low', name: 'Low' },
];

export const SKILL_OPTIONS = [
  { _id: 'typescript', name: 'TypeScript' },
  { _id: 'vue', name: 'Vue 3' },
  { _id: 'vuetify', name: 'Vuetify' },
  { _id: 'api-design', name: 'API Design' },
  { _id: 'ux', name: 'UX' },
  { _id: 'testing', name: 'Testing' },
];

export const SEARCH_FIELDS = [
  { _id: 'name', name: 'Name' },
  { _id: 'email', name: 'Email' },
  { _id: 'role', name: 'Role' },
  { _id: 'status', name: 'Status' },
];

export const PEOPLE_HEADERS = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Rate', key: 'hourlyRate' },
];

export const LINE_ITEM_HEADERS = [
  { title: 'Deliverable', key: 'name' },
  { title: 'Qty', key: 'quantity' },
  { title: 'Price', key: 'price' },
  { title: 'Total', key: 'total' },
  { title: 'Note', key: 'note' },
];

export const RICH_TABLE_HEADERS = [
  { title: 'Name', key: 'name' },
  { title: 'Role', key: 'role' },
  { title: 'Status', key: 'status' },
  { title: 'Email', key: 'email', isHTML: true },
];

export const SERVER_TABLE_HEADERS = [
  { title: 'Name', key: 'name' },
  { title: 'Priority', key: 'priority' },
  { title: 'Skills', key: 'skills' },
  { title: 'Joined', key: 'joinedDate' },
];

export function createSeedStore() {
  const people: DemoPerson[] = [
    {
      _id: 'person-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'Platform Architect',
      status: 'active',
      managerId: 'person-3',
      tags: ['core-team', 'mentor'],
      priority: 'high',
      skills: ['typescript', 'vue', 'api-design'],
      active: true,
      newsletter: true,
      age: 36,
      hourlyRate: 148.5,
      joinedDate: '2024-04-12',
      meetingTime: '09:30',
      appointment: '2026-03-14T09:30:00.000Z',
      bio: 'Owns the UI architecture and keeps the component model tidy.',
      favoriteColor: '#146eb4ff',
      notesHtml: '<p><strong>Ada</strong> is piloting the typed UI workflow.</p><ul><li>Watch collection editing</li><li>Review report flow</li></ul>',
      welcomeHtml: '<div><h3>HTML View</h3><p>This field renders trusted HTML directly from storage.</p></div>',
      script: 'const milestone = "typed-ui";\nconsole.log(`shipping ${milestone}`);',
      conversation: [
        { user: 'Ada', message: 'The report flow feels solid now.', color: 'blue-grey-lighten-5' },
        { user: 'Review Bot', message: 'Selector and trigger bindings look good.', right: true, color: 'green-lighten-5' },
      ],
      lineItems: [
        { _id: 'line-1', name: 'Architecture Review', quantity: 2, price: 180, total: 360, note: 'Kickoff session' },
        { _id: 'line-2', name: 'Field Audit', quantity: 4, price: 140, total: 560, note: 'Input coverage pass' },
      ],
      avatar: '',
      resume: '',
      teamSelection: [],
      virtualSelection: [],
      serverSelection: [],
      reportSelection: [],
    },
    {
      _id: 'person-2',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      role: 'Technical Lead',
      status: 'paused',
      managerId: 'person-3',
      tags: ['delivery', 'systems'],
      priority: 'medium',
      skills: ['testing', 'api-design'],
      active: false,
      newsletter: false,
      age: 42,
      hourlyRate: 132.0,
      joinedDate: '2025-01-08',
      meetingTime: '11:00',
      appointment: '2026-03-18T11:00:00.000Z',
      bio: 'Leads delivery planning and large rollout coordination.',
      favoriteColor: '#ff9f1c',
      notesHtml: '<p>Paused while focusing on cross-team rollout.</p>',
      welcomeHtml: '<p>Grace is using the read-only report mode in the demo.</p>',
      script: 'function estimate(days) {\n  return days * 3;\n}',
      conversation: [
        { user: 'Grace', message: 'Server tables are loading from the memory API.', color: 'amber-lighten-5' },
      ],
      lineItems: [
        { _id: 'line-3', name: 'Roadmap Review', quantity: 1, price: 220, total: 220, note: 'Quarter planning' },
      ],
      avatar: '',
      resume: '',
      teamSelection: [],
      virtualSelection: [],
      serverSelection: [],
      reportSelection: [],
    },
    {
      _id: 'person-3',
      name: 'Katherine Johnson',
      email: 'katherine@example.com',
      role: 'Engineering Manager',
      status: 'active',
      managerId: null,
      tags: ['leadership'],
      priority: 'high',
      skills: ['ux', 'testing'],
      active: true,
      newsletter: true,
      age: 44,
      hourlyRate: 156.0,
      joinedDate: '2023-11-01',
      meetingTime: '08:45',
      appointment: '2026-03-20T08:45:00.000Z',
      bio: 'Focuses on roadmap, staffing, and quality standards.',
      favoriteColor: '#2a9d8f',
      notesHtml: '<p>Managers can use the collection flow to edit several records.</p>',
      welcomeHtml: '<p>Katherine is the manager option for autocomplete fields.</p>',
      script: 'export const approve = () => true;',
      conversation: [
        { user: 'Katherine', message: 'Collection mode should walk through selected records.', color: 'teal-lighten-5' },
      ],
      lineItems: [
        { _id: 'line-4', name: 'Manager Sync', quantity: 3, price: 90, total: 270, note: 'Cross-functional' },
      ],
      avatar: '',
      resume: '',
      teamSelection: [],
      virtualSelection: [],
      serverSelection: [],
      reportSelection: [],
    },
  ];

  return {
    people,
    udfs: [],
  };
}
