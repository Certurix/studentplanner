const Alert = ({ title, message, type }) => {
  const getAlertStyles = (type) => {
    switch (type) {
      case "error":
        return "text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800";
      case "warning":
        return "text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800";
      case "info":
        return "text-blue-800 border-blue-300 bg-indigo-600 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800";
      case "success":
        return "text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800";
      default:
        return "text-gray-800 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-800";
    }
  };

  return (
    <div
      className={`p-3 border rounded-lg ${getAlertStyles(type)}`}
      role="alert"
    >
      <div className="flex items-center">
        <svg
          className="flex-shrink-0 w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span className="sr-only">{type}</span>
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default Alert;
