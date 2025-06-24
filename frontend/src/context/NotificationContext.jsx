import React, { createContext, useState, useCallback } from "react";
import { Icon } from "@iconify-icon/react";

// Création du contexte des notifications
const NotificationContext = createContext();

// Définition des types de notifications avec leurs icônes et styles
const TOAST_TYPES = {
  success: {
    icon: (
      <Icon
        icon="mdi:check-circle"
        width="20"
        height="20"
        className="text-green-700 dark:text-green-300"
      />
    ),
    bgColor: "bg-green-100 dark:bg-green-800 dark:bg-opacity-20",
    textColor: "text-green-700 dark:text-green-400",
    borderColor: "border-green-500",
    iconBgColor: "bg-green-100 dark:bg-green-800",
  },
  error: {
    icon: (
      <Icon
        icon="mdi:alert-circle"
        width="20"
        height="20"
        className="text-red-700 dark:text-red-300"
      />
    ),
    bgColor: "bg-red-100 dark:bg-red-800 dark:bg-opacity-20",
    textColor: "text-red-700 dark:text-red-400",
    borderColor: "border-red-500",
    iconBgColor: "bg-red-100 dark:bg-red-800",
  },
  warning: {
    icon: (
      <Icon
        icon="mdi:alert"
        width="20"
        height="20"
        className="text-yellow-700 dark:text-yellow-300"
      />
    ),
    bgColor: "bg-yellow-100 dark:bg-yellow-800 dark:bg-opacity-20",
    textColor: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-500",
    iconBgColor: "bg-yellow-100 dark:bg-yellow-800",
  },
  info: {
    icon: (
      <Icon
        icon="mdi:information"
        width="20"
        height="20"
        className="text-blue-700 dark:text-blue-300"
      />
    ),
    bgColor: "bg-blue-100 dark:bg-blue-800 dark:bg-opacity-20",
    textColor: "text-blue-700 dark:text-blue-400",
    borderColor: "border-blue-500",
    iconBgColor: "bg-blue-100 dark:bg-blue-800",
  },
};

// Durée par défaut pour les notifications
const DEFAULT_DURATION = 4000;

export const NotificationProvider = ({ children }) => {
  // Etat pour stocker les notifications
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    (message, { type = "info", duration = DEFAULT_DURATION, title } = {}) => {
      if (!title) {
        switch (type) {
          case "success":
            title = "Succès";
            break;

          case "error":
            title = "Erreur";
            break;

          case "warning":
            title = "Avertissement";
            break;

          case "info":
            title = "Information";
            break;

          default:
            break;
        }
      }

      // Création d'un ID unique pour la notification
      const id = Date.now() + Math.random().toString(36).substr(2, 5);

      // Ajout de la notification à l'état pour la stocker et l'afficher
      setNotifications((prev) => [
        ...prev,
        { id, message, type, duration, title, timestamp: Date.now() },
      ]);

      // Suppression automatique de la notification après la durée
      setTimeout(() => {
        removeNotification(id);
      }, duration);

      return id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    // Changement de l'état pour marquer la notification comme en cours de sortie (animation)
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isExiting: true }
          : notification
      )
    );

    // Suppression de la notification après la durée de l'animation
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    }, 300);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Valeurs fournies par le contexte
  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
  // Rendu du provider avec les notifications
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((notification) => {
          const toastType = TOAST_TYPES[notification.type] || TOAST_TYPES.info;

          return (
            <div
              key={notification.id}
              className={`flex items-center w-full max-w-xs p-4 mb-4 border rounded-lg shadow ${
                toastType.bgColor
              } ${toastType.textColor} ${toastType.borderColor} ${
                notification.isExiting
                  ? "animate-slide-out-right"
                  : "animate-slide-in-right"
              } transition-all duration-300 ease-in-out`}
              role="alert"
            >
              {" "}
              <div
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toastType.iconBgColor}`}
              >
                {toastType.icon}
              </div>
              <div className="ml-3 text-sm font-normal">
                {notification.title && (
                  <span className="font-semibold block">
                    {notification.title}
                  </span>
                )}
                <span>{notification.message}</span>
              </div>
              <button
                type="button"
                className={`ml-auto -mx-1.5 -my-1.5 ${toastType.bgColor} ${toastType.textColor} rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex h-8 w-8`}
                aria-label="Close"
                onClick={() => removeNotification(notification.id)}
              >
                <span className="sr-only">Fermer</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
