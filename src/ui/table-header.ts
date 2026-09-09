import type { UIText } from './runtime';

/** Shared table header shape used by Field and Trigger table renderers. */
export interface UITableHeader {
  title?: UIText;
  key?: any;
  value?: any;
  children?: UITableHeader[];
  [key: string]: any;
}

export type UITableHeaderTextResolver = (value: UIText | undefined) => string;

export type UIResolvedTableHeader<T extends UITableHeader = UITableHeader> =
  Omit<T, 'title'|'children'> & {
    title?: string;
    children?: UIResolvedTableHeader[];
  };

/** Resolve translatable titles without mutating application-owned header definitions. */
export function resolveUITableHeaders<T extends UITableHeader>(
  headers: readonly T[] | undefined,
  resolveText: UITableHeaderTextResolver,
): UIResolvedTableHeader<T>[] {
  return (headers || []).map((header) => {
    const resolved = {
      ...header,
      ...(header.title !== undefined ? { title: resolveText(header.title) } : {}),
    } as UIResolvedTableHeader<T>;

    if (Array.isArray(header.children)) {
      resolved.children = resolveUITableHeaders(header.children, resolveText);
    }

    return resolved;
  });
}
