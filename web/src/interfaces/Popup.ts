export interface PopupProps {
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
    dialogText: string;
  }