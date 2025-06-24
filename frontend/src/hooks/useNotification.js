import { useContext } from "react";
import NotificationContext from "../context/NotificationContext";

const useNotification = () => {
  const { addNotification, removeNotification, clearNotifications } =
    useContext(NotificationContext);

  const notify = (message, options = {}) => {
    return addNotification(message, options);
  };

  const success = (message, options = {}) => {
    return addNotification(message, { ...options, type: "success" });
  };

  const error = (message, options = {}) => {
    return addNotification(message, { ...options, type: "error" });
  };

  const warning = (message, options = {}) => {
    return addNotification(message, { ...options, type: "warning" });
  };

  const info = (message, options = {}) => {
    return addNotification(message, { ...options, type: "info" });
  };

  return {
    notify,
    success,
    error,
    warning,
    info,
    remove: removeNotification,
    clear: clearNotifications,
  };
};

export default useNotification;
