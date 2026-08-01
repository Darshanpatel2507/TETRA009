import { classNames } from "../../lib/utils/formatters";
import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, rows, rowKey, empty, onRowClick }: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-card border border-border bg-surface p-8 text-center text-text-secondary">
        {empty ?? "No rows."}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-surface-muted text-text-secondary">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={classNames(
                  "text-left font-medium px-4 py-3",
                  c.className ?? "",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={classNames(
                "border-t border-border hover:bg-surface-muted/60 transition-colors",
                onRowClick && "cursor-pointer",
              )}
            >
              {columns.map((c) => (
                <td key={c.key} className={classNames("px-4 py-3 align-middle", c.className ?? "")}>
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
