import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

// Define the notification type
interface Notification {
  id: number;
  message: string;
  link?: string;
}

// Define the context types
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, link?: string) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

// Create the NotificationContext
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// Hook to use the context in components
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

// Provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to add notification and trigger a toast
  const addNotification = (message: string, link?: string) => {
    const newNotification: Notification = {
      id: Date.now(), // Unique ID for the notification
      message,
      link,
    };

    // Add the notification to the dropdown list
    setNotifications((prev) => [...prev, newNotification]);

    // Trigger a toast message
    toast.info(newNotification.message);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, setNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
