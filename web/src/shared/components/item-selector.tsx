import { Check } from "lucide-react";
import * as React from "react";
import { useCallback, useContext, useMemo, useState } from "react";

import { cn } from "@/shared/lib/utils";

// NEW file. Used mainly with DataTable and DataGrid for selection functionality.
// At some point this should be split into a provider file and component file.

export interface ItemSelectorContextValue {
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  selectMultiple: (ids: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  canSelect: (id: string) => boolean;
  selectionLimit: number | null;
  selectionCount: number;
  isLimitReached: boolean;
}

const ItemSelectorContext =
  React.createContext<ItemSelectorContextValue | null>(null);

export function useItemSelector() {
  const context = useContext(ItemSelectorContext);
  if (!context) {
    throw new Error("useItemSelector must be used within ItemSelectorProvider");
  }
  return context;
}

interface ItemSelectorProviderProps {
  children: React.ReactNode;
  selectionLimit?: number | null;
  onSelectionChange?: (selectedIds: string[]) => void;
  defaultSelected?: string[];
}

export const ItemSelectorProvider = ({
  children,
  selectionLimit = null,
  onSelectionChange,
  defaultSelected = [],
}: ItemSelectorProviderProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(defaultSelected)
  );

  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else if (selectionLimit === null || newSet.size < selectionLimit) {
          // Check if we can add more items
          newSet.add(id);
        }
        onSelectionChange?.(Array.from(newSet));
        return newSet;
      });
    },
    [selectionLimit, onSelectionChange]
  );

  const selectMultiple = useCallback(
    (ids: string[]) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        // Add items up to the limit
        for (const id of ids) {
          if (selectionLimit === null || newSet.size < selectionLimit) {
            newSet.add(id);
          } else {
            break; // Stop when limit is reached
          }
        }
        onSelectionChange?.(Array.from(newSet));
        return newSet;
      });
    },
    [selectionLimit, onSelectionChange]
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const canSelect = useCallback(
    (id: string) => {
      if (selectedIds.has(id)) return true;
      if (selectionLimit === null) return true;
      return selectedIds.size < selectionLimit;
    },
    [selectedIds, selectionLimit]
  );

  const isLimitReached = useMemo(() => {
    if (selectionLimit === null) return false;
    return selectedIds.size >= selectionLimit;
  }, [selectedIds, selectionLimit]);

  const value = useMemo<ItemSelectorContextValue>(() => {
    return {
      selectedIds,
      toggleSelection,
      selectMultiple,
      clearSelection,
      isSelected,
      canSelect,
      selectionLimit,
      selectionCount: selectedIds.size,
      isLimitReached,
    };
  }, [
    selectedIds,
    toggleSelection,
    selectMultiple,
    clearSelection,
    isSelected,
    canSelect,
    selectionLimit,
    isLimitReached,
  ]);

  return (
    <ItemSelectorContext.Provider value={value}>
      {children}
    </ItemSelectorContext.Provider>
  );
};

interface SelectableCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const SelectableCard = ({
  id,
  children,
  className,
  onClick,
}: SelectableCardProps) => {
  const { isSelected, canSelect, toggleSelection } = useItemSelector();
  const selected = isSelected(id);
  const selectable = canSelect(id);

  const handleClick = () => {
    if (selectable || selected) {
      toggleSelection(id);
      onClick?.();
    }
  };

  // Purely for accessibility to allow keyboard selection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={selectable || selected ? 0 : -1}
      className={cn(
        "relative cursor-pointer transition-all duration-200",
        selected && "ring-2 ring-primary-surface-default ring-offset-2",
        !selectable && !selected && "opacity-40 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "absolute top-3 right-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
          selected
            ? "border-primary-surface-default bg-primary-surface-default text-white"
            : "border-[#c1cfd7] bg-white"
        )}
      >
        {selected && <Check className="h-4 w-4" />}
      </div>
      {children}
    </div>
  );
};

interface SelectableRowProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SelectableRow = ({
  id,
  children,
  className,
}: SelectableRowProps) => {
  const { isSelected, canSelect, toggleSelection } = useItemSelector();
  const selected = isSelected(id);
  const selectable = canSelect(id);

  const handleClick = () => {
    if (selectable || selected) {
      toggleSelection(id);
    }
  };

  return (
    <tr
      className={cn(
        "cursor-pointer transition-colors",
        selected && "bg-primary-surface-default/10",
        !selectable && !selected && "opacity-40 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
    >
      <td className="w-12 px-4">
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded border-2 transition-all",
            selected
              ? "border-primary-surface-default bg-primary-surface-default text-white"
              : "border-[#c1cfd7] bg-white"
          )}
        >
          {selected && <Check className="h-3 w-3" />}
        </div>
      </td>
      {children}
    </tr>
  );
};

interface SelectionSummaryProps {
  className?: string;
}

export const SelectionSummary = ({ className }: SelectionSummaryProps) => {
  const { selectionCount, selectionLimit, isLimitReached } = useItemSelector();

  if (selectionCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-[#c1cfd7] bg-white px-4 py-2 text-sm",
        className
      )}
    >
      <span className="font-medium text-[#28363e]">
        {selectionCount} {selectionCount === 1 ? "item" : "items"} selected
      </span>
      {selectionLimit !== null && (
        <span className="text-[#628397]">(max {selectionLimit})</span>
      )}
      {isLimitReached && (
        <span className="ml-2 rounded-full bg-[#f1cc4f] px-2 py-0.5 text-xs font-medium text-[#28363e]">
          Limit reached
        </span>
      )}
    </div>
  );
};
