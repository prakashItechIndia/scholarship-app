import * as React from "react";
import { DetailsList, IColumn, IDetailsListProps, DetailsListLayoutMode } from "@fluentui/react";
import { cn } from "../lib/utils";

export interface TableProps extends Omit<IDetailsListProps, "items" | "columns"> {
  columns: Array<{
    key: string;
    name: string;
    fieldName?: string;
    minWidth?: number;
    maxWidth?: number;
    isResizable?: boolean;
    onRender?: (item?: any, index?: number) => React.ReactNode;
  }>;
  data: any[];
}

const Table = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, columns, data, ...props }, ref) => {
    const fluentColumns: IColumn[] = columns.map((col) => ({
      key: col.key,
      name: col.name,
      fieldName: col.fieldName || col.key,
      minWidth: col.minWidth || 100,
      maxWidth: col.maxWidth,
      isResizable: col.isResizable !== false,
      onRender: col.onRender,
    }));

    return (
      <div ref={ref} className={cn("relative w-full overflow-auto", className)}>
        <DetailsList
          items={data}
          columns={fluentColumns}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          {...props}
        />
      </div>
    );
  },
);

Table.displayName = "Table";

// Additional table components for compatibility
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors hover:bg-gray-50", className)}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium", className)} {...props} />
));
TableHead.displayName = "TableHead";

const TableHeaderCell = TableHead;

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle", className)} {...props} />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-gray-500", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableCaption,
};

