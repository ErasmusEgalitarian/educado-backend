"use client";

import { Card, CardContent } from "@/shared/components/shadcn/card";
import { cn } from "@/shared/lib/utils";

import type {
  DataGridProps,
  DataDisplayItem,
} from "./types/data-display-types";

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

  if (isLoading) {
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
        <div key={item.id}>{gridItemRender(item)}</div>
      ))}
    </div>
  );
};

export default DataGrid;
