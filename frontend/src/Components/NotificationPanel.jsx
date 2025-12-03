import React from "react";

// Placeholder for notifications
const NotificationPanel = ({ isOpen, onClose, onNotificationRead }) => {
  if (!isOpen) {
    return null;
  }

  // Placeholder for notifications
  const notifications = [
    { id: 1, message: "New patient registered.", type: "info" },
    { id: 2, message: "Appointment reminder for John Doe.", type: "warning" },
    { id: 3, message: "System update completed.", type: "success" },
  ];

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
      <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100 flex justify-between items-center">
        <span>Notifications</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {notification.message}
            </li>
          ))}
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={onNotificationRead}
            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
          >
            Mark all as read
          </button>
        </ul>
      ) : (
        <p className="px-4 py-2 text-sm text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};

export default NotificationPanel;
