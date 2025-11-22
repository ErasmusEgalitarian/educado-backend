import { Card, CardContent } from "@/shared/components/shadcn/card";
import { SelectableCard } from "@/shared/data-display/item-selector";
import { cn } from "@/shared/lib/utils";

import { DataDisplayItem } from "./data-display";

export interface DataGridProps<T extends DataDisplayItem> {
  data: T[];
  gridItemRender?: (item: T) => React.ReactNode;
  isLoading?: boolean;
  className?: string;
  selectable?: boolean;
  itemMinWidth?: string;
}

/**
 * A generic grid component that displays data items in a responsive grid layout.
 *
 * @template T - The type of data items to display, must extend DataDisplayItem
 *
 * @param {Readonly<DataGridProps<T>>} props - The component props
 * @param {T[]} props.data - Array of data items to display in the grid
 * @param {(item: T) => React.ReactNode} props.gridItemRender - Function to render each grid item
 * @param {boolean} [props.isLoading] - Whether the grid is in a loading state
 * @param {string} [props.className] - Additional CSS classes to apply to the grid container
 * @param {string} [props.itemMinWidth] - Minimum width for grid items (default: "320px")
 *
 * @returns {JSX.Element} A responsive grid with 1-4 columns based on screen size
 *
 * @throws {Error} When gridItemRender is not provided and isLoading is false
 *
 * @example
 * ```tsx
 * <DataGrid
 *   data={users}
 *   gridItemRender={(user) => <UserCard user={user} />}
 *   isLoading={false}
 *   className="my-custom-class"
 *   itemMinWidth="250px"
 * />
 * ```
 */
const DataGrid = <T extends DataDisplayItem>({
  data,
  gridItemRender,
  isLoading,
  className,
  selectable = false,
  itemMinWidth = "320px",
}: Readonly<DataGridProps<T>>): React.JSX.Element => {
  if (!gridItemRender) {
    throw new Error(
      "DataGrid requires a gridItemRender function to render items"
    );
  }

  if (isLoading === true) {
    return (
      <div
        className={cn("grid gap-4", className)}
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(min(${itemMinWidth}, 100%), 1fr))`,
        }}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <div key={`loading-grid-${String(index)}`}>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div
                      key={`loading-item-${String(index)}`}
                      className="space-y-1"
                    >
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("grid gap-6", className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(min(${itemMinWidth}, 100%), 1fr))`,
      }}
    >
      {data.map((item, index) =>
        selectable &&
        item.documentId !== undefined &&
        item.documentId !== "" ? (
          <SelectableCard key={item.documentId} id={item.documentId}>
            {gridItemRender(item)}
          </SelectableCard>
        ) : (
          <div key={item.documentId ?? `item-${String(index)}`}>
            {gridItemRender(item)}
          </div>
        )
      )}
    </div>
  );
};

export default DataGrid;
