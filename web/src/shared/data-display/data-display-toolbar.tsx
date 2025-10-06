import { Grid, List, Search } from "lucide-react";

import { Button } from "@/shared/components/shadcn/button";
import { Input } from "@/shared/components/shadcn/input";

import { DataDisplayToolbarProps } from "./types/data-display-types";

const DataDisplayToolbar: React.FC<DataDisplayToolbarProps> = ({
  viewMode,
  onViewModeChange,
  searchValue = "",
  onSearchChange,
  className,
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${className ?? ""}`}
    >
      {/* View mode toggle - left side */}
      <div className="flex items-center bg-muted rounded-lg p-1">
        <Button
          variant={viewMode === "grid" ? "primary" : "ghost"}
          size="sm"
          onClick={() => {
            onViewModeChange("grid");
          }}
          className="h-8 w-8 p-0"
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "table" ? "primary" : "ghost"}
          size="sm"
          onClick={() => {
            onViewModeChange("table");
          }}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Search - right side */}
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            className="pl-10"
          />
        </div>
      )}
    </div>
  );
};

export default DataDisplayToolbar;
