import { useState, useCallback } from "react";

import { ReusableAlertDialogProps } from "./reusable-alert-dialog";

interface UseAlertDialogReturn {
  isOpen: boolean;
  openAlert: () => void;
  closeAlert: () => void;
  alertProps: Pick<ReusableAlertDialogProps, "isOpen" | "onOpenChange">;
}

/**
 * Hook to manage alert dialog state
 *
 * @example
 * ```tsx
 * const { isOpen, openAlert, closeAlert, alertProps } = useAlertDialog();
 *
 * <button onClick={openAlert}>Delete</button>
 * <ReusableAlertDialog
 *   {...alertProps}
 *   title="Confirm Delete"
 *   description="Are you sure?"
 *   confirmAction={{ label: "Delete", onClick: handleDelete }}
 * />
 * ```
 */
export const useAlertDialog = (): UseAlertDialogReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openAlert = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeAlert = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openAlert,
    closeAlert,
    alertProps: {
      isOpen,
      onOpenChange: setIsOpen,
    },
  };
};
