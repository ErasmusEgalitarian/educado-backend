import { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../shadcn/alert-dialog";

export interface AlertAction {
  label: string | ReactNode;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

export interface ReusableAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string | ReactNode;
  description?: string | ReactNode;
  confirmAction?: AlertAction;
  cancelAction?: AlertAction;
  showCancel?: boolean;
  children?: ReactNode;
}

/**
 * A reusable alert dialog component that can be configured with custom text and actions.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ReusableAlertDialog
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Delete Account?"
 *   description="This action cannot be undone."
 *   confirmAction={{
 *     label: "Delete",
 *     onClick: handleDelete,
 *     variant: "destructive"
 *   }}
 *   cancelAction={{
 *     label: "Cancel",
 *     onClick: () => setIsOpen(false)
 *   }}
 * />
 * ```
 */
const ReusableAlertDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmAction,
  cancelAction,
  showCancel = true,
  children,
}: ReusableAlertDialogProps) => {
  const handleConfirm = () => {
    confirmAction?.onClick();
    onOpenChange(false);
  };

  const handleCancel = () => {
    cancelAction?.onClick();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {Boolean(description) && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          {showCancel && (
            <AlertDialogCancel
              onClick={handleCancel}
              className={cancelAction?.className}
            >
              {cancelAction?.label ?? "Cancel"}
            </AlertDialogCancel>
          )}
          {confirmAction && (
            <AlertDialogAction
              onClick={handleConfirm}
              className={confirmAction.className}
            >
              {confirmAction.label}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReusableAlertDialog;
