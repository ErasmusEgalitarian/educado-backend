import { Card, CardContent } from "@/shared/components/shadcn/card";
import { cn } from "@/shared/lib/utils";

import { DataDisplayItem } from "./data-display";

export interface DataGridProps<T extends DataDisplayItem> {
  data: T[];
  gridItemRender?: (item: T) => React.ReactNode;
  isLoading?: boolean;
  className?: string;
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
 * />
 * ```
 */
const DataGrid = <T extends DataDisplayItem>({
  data,
  gridItemRender,
  isLoading,
  className,
}: Readonly<DataGridProps<T>>) => {
  const renderLoadingGridItem = () => (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={`loading-item-${String(index)}`} className="space-y-1">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading === true) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
          className
        )}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <div key={`loading-grid-${String(index)}`}>
            {renderLoadingGridItem()}
          </div>
        ))}
      </div>
    );
  }

  if (!gridItemRender) {
    throw new Error(
      "DataGrid requires a gridItemRender function to render items"
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        className
      )}
    >
      {data.map((item) => (
        <div key={item.documentId}>{gridItemRender(item)}</div>
      ))}
    </div>
  );
};

export default DataGrid;
