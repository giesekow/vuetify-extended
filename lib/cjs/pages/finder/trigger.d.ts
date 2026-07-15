import type { ReportMode } from '../../ui/base';
import type { NavigationEntry } from '../../ui/runtime';
export declare function createFinderTrigger(mode?: ReportMode): (entry?: NavigationEntry) => import("../../ui").Trigger;
