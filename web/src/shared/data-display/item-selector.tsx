import { mdiCheck } from "@mdi/js";
import Icon from "@mdi/react";
import * as React from "react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

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

export interface ItemSelectorController {
  clearSelection: () => void;
}

interface ItemSelectorProviderProps {
  children: React.ReactNode;
  selectionLimit?: number | null;
  onSelectionChange?: (selectedIds: string[]) => void;
  defaultSelected?: string[];
  controllerRef?: React.MutableRefObject<ItemSelectorController | null>;
}

export const ItemSelectorProvider = ({
  children,
  selectionLimit = null,
  onSelectionChange,
  defaultSelected = [],
  controllerRef,
}: ItemSelectorProviderProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(defaultSelected)
  );

  // Use ref to always have the latest callback without causing re-renders
  const onSelectionChangeRef = useRef(onSelectionChange);
  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    onSelectionChangeRef.current?.([]);
  }, []);

  // Expose methods via controllerRef
  useEffect(() => {
    if (controllerRef) {
      controllerRef.current = {
        clearSelection,
      };
    }
  }, [controllerRef, clearSelection]);

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
        onSelectionChangeRef.current?.(Array.from(newSet));
        return newSet;
      });
    },
    [selectionLimit]
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
        onSelectionChangeRef.current?.(Array.from(newSet));
        return newSet;
      });
    },
    [selectionLimit]
  );

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
      aria-pressed={selected}
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
        {selected && <Icon path={mdiCheck} className="h-4 w-4" />}
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
          {selected && <Icon path={mdiCheck} className="h-3 w-3" />}
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
  const { t } = useTranslation();
  const { selectionCount, selectionLimit, isLimitReached } = useItemSelector();

  if (selectionCount === 0) return null;

  return (
    <div
      className={cn(
        "flex h-8 items-center gap-2 rounded-md border border-greyscale-border-default bg-white px-3 text-sm",
        className
      )}
    >
      <span className="font-medium text-[#28363e]">
        {selectionCount === 1
          ? t("selection.itemSelected", { count: selectionCount })
          : t("selection.itemsSelected", { count: selectionCount })}
      </span>
      {selectionLimit !== null && (
        <span className="text-[#628397]">
          ({t("selection.max", { limit: selectionLimit })})
        </span>
      )}
      {isLimitReached && (
        <span className="ml-2 rounded-full bg-[#f1cc4f] px-2 text-xs font-medium text-[#28363e]">
          {t("selection.limitReached")}
        </span>
      )}
    </div>
  );
};
