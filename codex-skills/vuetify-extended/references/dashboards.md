# Dashboards

Use this reference when building or modifying `Dashboard` pages or dashboard widgets.

Primary sources:

- `docs/ui/Dashboard.md`
- `src/ui/dashboard.ts`
- `test/src/demos.ts`

## Core Model

- `Dashboard` extends `UIBase`
- it is shown with `AppManager.showUI(...)`
- layout is split into:
  - `topChildren`
  - `children`
  - `bottomChildren`

Use a dashboard when the screen is read-first and widget-driven rather than form/report-driven.

## Widget Rules

All widget types inherit from `DashboardWidget`.

Shared behavior:

- card shell
- theme inheritance
- optional text color override
- refresh support
- height/minHeight/maxHeight support
- overflow scroll behavior

If a task changes widget rendering, check whether the behavior belongs in the shared shell or only in one widget type.

## Important Widget Families

- `DashboardMetricWidget`
  - headline KPI values
- `DashboardTableWidget`
  - tabular detail
- `DashboardListWidget`
  - simple item lists
- `DashboardProgressWidget`
  - progress rows / summary bars
- `DashboardChartWidget`
  - chart-driven summaries
- `DashboardTimelineWidget`
  - dated events/activity
- `DashboardActionListWidget`
  - action menus / operational links
- `DashboardAlertWidget`
  - warnings/status callouts
- `DashboardMapWidget`
  - geographic summary panels
- `DashboardTabsWidget`
  - grouped content panes

Read `docs/ui/Dashboard.md` for expected value/data formats before changing any widget behavior.

## Interaction Rules

- dashboard refresh should cascade through child widgets
- dashboard menu reuses `MenuItem` definitions
- keyboard behavior is part of the public dashboard model

If a change affects dashboard actions, refresh, or keyboard support, update docs in `docs/ui/Dashboard.md`.

